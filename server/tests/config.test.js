describe("validateConfig", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("throws in production when JWT_SECRET is missing", () => {
    process.env.NODE_ENV = "production";
    process.env.JWT_SECRET = "";

    const { validateConfig } = require("../src/config");
    expect(() => validateConfig()).toThrow(/JWT_SECRET/);
  });

  test("passes in test with JWT_SECRET set", () => {
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET = "test-jwt-secret-with-enough-length";

    const { validateConfig } = require("../src/config");
    expect(() => validateConfig()).not.toThrow();
  });
});
