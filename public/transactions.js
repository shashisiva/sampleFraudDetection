const API_BASE = window.location.origin;
const TOKEN_KEY = "fraud_review_token";
const USER_KEY = "fraud_review_user";

let currentPage = 1;
const historyCache = new Map();
const expandedRows = new Set();

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function showToast(message, isError = true) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.toggle("toast-error", isError);
  el.classList.toggle("toast-success", !isError);
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 4000);
}

async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    clearSession();
    showLogin();
    throw new Error(data.error || "Authentication required");
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

function showLogin() {
  document.getElementById("login-section").classList.remove("hidden");
  document.getElementById("app-section").classList.add("hidden");
  document.getElementById("logout-btn").classList.add("hidden");
  document.getElementById("user-info").textContent = "";
}

function showApp() {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("app-section").classList.remove("hidden");
  document.getElementById("logout-btn").classList.remove("hidden");
  const user = getUser();
  document.getElementById("user-info").textContent = user
    ? `${user.name} (${user.email})`
    : "";
}

function formatAmount(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
}

function formatDate(iso) {
  const d = new Date(iso.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status) {
  const map = {
    pending: { label: "Unmarked", icon: "⚪", className: "status-pending" },
    fraud: { label: "Fraud", icon: "🔴", className: "status-fraud" },
    legitimate: { label: "Legitimate", icon: "🟢", className: "status-legitimate" },
  };
  const s = map[status] || map.pending;
  return `<span class="status ${s.className}" data-status="${status}">${s.icon} ${s.label}</span>`;
}

function setRowBadge(row, status) {
  const cell = row.querySelector("[data-status-cell]");
  if (cell) cell.innerHTML = statusBadge(status);
  row.dataset.status = status;
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const errEl = document.getElementById("login-error");
  errEl.textContent = "";

  try {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setSession(data.token, data.user);
    showApp();
    currentPage = 1;
    await loadTransactions();
  } catch (e) {
    errEl.textContent = e.message;
  }
}

function handleLogout() {
  clearSession();
  showLogin();
}

function renderAuditPanel(txId, entries) {
  if (!entries.length) {
    return '<div class="audit-panel-inner"><p class="muted">No audit history.</p></div>';
  }
  const items = entries
    .map(
      (e) =>
        `<li><strong>${e.markedBy || e.userEmail}</strong> → ${e.newStatus} · ${formatDate(e.createdAt)}</li>`
    )
    .join("");
  return `<div class="audit-panel-inner"><ul class="history-list">${items}</ul></div>`;
}

async function toggleAuditRow(txId) {
  const detail = document.querySelector(`tr[data-audit-for="${txId}"]`);
  if (!detail) return;

  if (expandedRows.has(txId)) {
    expandedRows.delete(txId);
    detail.classList.add("hidden");
    return;
  }

  expandedRows.add(txId);
  detail.classList.remove("hidden");
  detail.querySelector(".audit-panel-inner").innerHTML = "<p class=\"muted\">Loading audit…</p>";

  try {
    if (!historyCache.has(txId)) {
      const data = await api(`/transactions/${txId}/history`);
      historyCache.set(txId, data.history);
    }
    detail.querySelector(".audit-panel-inner").outerHTML = renderAuditPanel(
      txId,
      historyCache.get(txId)
    ).trim();
  } catch (e) {
    detail.querySelector(".audit-panel-inner").innerHTML =
      `<p class="error">${e.message}</p>`;
    expandedRows.delete(txId);
  }
}

async function markTransaction(row, id, status, button) {
  const previous = row.dataset.status;
  setRowBadge(row, status);
  button.disabled = true;
  row.querySelectorAll("button[data-action]").forEach((b) => {
    b.disabled = true;
  });

  try {
    await api(`/transactions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    historyCache.delete(id);
    showToast("Status updated", false);
  } catch (e) {
    setRowBadge(row, previous);
    showToast(e.message);
  } finally {
    row.querySelectorAll("button[data-action]").forEach((b) => {
      b.disabled = false;
      if (b.dataset.action === row.dataset.status) b.disabled = true;
    });
  }
}

async function loadTransactions(page = currentPage) {
  currentPage = page;
  const tbody = document.getElementById("tx-body");
  tbody.innerHTML = `<tr><td colspan="7" class="loading-cell">Loading transactions…</td></tr>`;
  expandedRows.clear();

  try {
    const data = await api(`/transactions?page=${page}`);
    const { data: rows, pagination } = data;

    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="loading-cell">No transactions to review.</td></tr>`;
    } else {
      tbody.innerHTML = rows
        .map((tx) => {
          const fraudDisabled = tx.status === "fraud" ? "disabled" : "";
          const legitDisabled = tx.status === "legitimate" ? "disabled" : "";
          return `
        <tr class="tx-row" data-id="${tx.id}" data-status="${tx.status}">
          <td class="expand-cell" data-expand="${tx.id}" title="Toggle audit">▸</td>
          <td>${formatDate(tx.createdAt)}</td>
          <td>${tx.merchant}</td>
          <td>${tx.externalId}</td>
          <td>${formatAmount(tx.amount, tx.currency)}</td>
          <td data-status-cell>${statusBadge(tx.status)}</td>
          <td class="actions-cell">
            <button class="danger" data-action="fraud" data-id="${tx.id}" ${fraudDisabled}>Mark Fraud</button>
            <button class="success" data-action="legitimate" data-id="${tx.id}" ${legitDisabled}>Mark Legitimate</button>
          </td>
        </tr>
        <tr class="audit-detail hidden" data-audit-for="${tx.id}">
          <td colspan="7"><div class="audit-panel-inner"><p class="muted">Expand row to load audit.</p></div></td>
        </tr>`;
        })
        .join("");
    }

    document.getElementById("page-info").textContent = `Page ${pagination.page} of ${pagination.totalPages} (${pagination.total} total)`;
    document.getElementById("prev-page").disabled = pagination.page <= 1;
    document.getElementById("next-page").disabled =
      pagination.page >= pagination.totalPages;
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="7" class="error">${e.message}</td></tr>`;
  }
}

function init() {
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("logout-btn").addEventListener("click", handleLogout);
  document.getElementById("prev-page").addEventListener("click", () =>
    loadTransactions(currentPage - 1)
  );
  document.getElementById("next-page").addEventListener("click", () =>
    loadTransactions(currentPage + 1)
  );

  document.getElementById("tx-body").addEventListener("click", async (e) => {
    const expand = e.target.closest("[data-expand]");
    if (expand) {
      await toggleAuditRow(Number(expand.dataset.expand));
      return;
    }

    const row = e.target.closest("tr.tx-row");
    if (row && !e.target.closest("button")) {
      await toggleAuditRow(Number(row.dataset.id));
      return;
    }

    const btn = e.target.closest("button[data-action]");
    if (!btn || btn.disabled) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;
    const txRow = btn.closest("tr.tx-row");
    await markTransaction(txRow, id, action, btn);
  });

  if (getToken()) {
    showApp();
    loadTransactions();
  } else {
    showLogin();
  }
}

init();
