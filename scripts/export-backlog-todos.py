"""Export 'To Do' rows from Fraud_Detection_Backlog.xlsx to openspec/backlog-todos.md"""
import sys
from pathlib import Path

try:
    import openpyxl
except ImportError:
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "install", "openpyxl", "-q"])
    import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / "Fraud_Detection_Backlog.xlsx"
if not XLSX.exists():
    XLSX = Path(
        r"C:\Users\ssivapragasam\OneDrive - Deloitte (O365D)\Documents\AI Learning\Fraud Detection\Fraud_Detection_Backlog.xlsx"
    )
OUT = ROOT / "openspec" / "backlog-todos.md"

wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
ws = wb["Product Backlog"]
rows = list(ws.iter_rows(values_only=True))
header = None
todos = []
for row in rows:
    if not row or not row[0]:
        continue
    sid = str(row[0]).strip()
    if sid == "Story ID":
        header = [str(c).strip() if c else "" for c in row]
        continue
    if not sid.startswith("FDS-"):
        continue
    rec = dict(
        zip(header, [str(c).strip() if c is not None else "" for c in row])
    )
    if rec.get("Status", "").strip().lower() == "to do":
        todos.append(rec)

lines = [
    "# Fraud Detection Backlog — To Do only",
    "",
    f"Source: `{XLSX.name}` → sheet **Product Backlog** (Status = **To Do**)",
    f"Exported: {len(todos)} items",
    "",
    "Use with OpenSpec: `/opsx:propose implement FDS-XX from backlog-todos` or paste a story ID in chat.",
    "",
    "| ID | Type | Summary | Priority | Points | REQ-ID |",
    "|---|---|---|---|---|---|",
]
for rec in todos:
    lines.append(
        f"| {rec.get('Story ID','')} | {rec.get('Type','')} | {rec.get('Summary','')} "
        f"| {rec.get('Priority','')} | {rec.get('Story Points','')} | {rec.get('REQ-ID','')} |"
    )
lines.append("\n## Details\n")
for rec in todos:
    lines.append(f"### {rec.get('Story ID')} — {rec.get('Summary')}\n")
    if rec.get("User Story"):
        lines.append(f"**User story:** {rec['User Story']}\n")
    if rec.get("Acceptance Criteria"):
        lines.append("**Acceptance criteria:**\n")
        for part in rec["Acceptance Criteria"].split("\n"):
            part = part.strip()
            if part:
                lines.append(f"- {part}")
        lines.append("")

OUT.write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote {len(todos)} To Do items to {OUT}")
wb.close()
