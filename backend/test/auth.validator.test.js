import assert from "node:assert/strict";
import test from "node:test";
import { validateNewPasswordInput } from "../src/validators/auth.validator.js";
import { requireSuperAdmin } from "../src/middlewares/auth.middleware.js";

test("accepts a new password with at least eight characters and letters and numbers", () => {
  assert.deepEqual(validateNewPasswordInput({ newPassword: "KataBaru123" }), {
    newPassword: "KataBaru123",
  });
});

test("rejects a new password shorter than eight characters", () => {
  assert.throws(
    () => validateNewPasswordInput({ newPassword: "Abc123" }),
    { status: 400 },
  );
});

test("rejects a new password without both letters and numbers", () => {
  assert.throws(
    () => validateNewPasswordInput({ newPassword: "KataSandi" }),
    { status: 400 },
  );
});

test("rejects a new password longer than the supported bcrypt input", () => {
  assert.throws(
    () => validateNewPasswordInput({ newPassword: `Aa1${"b".repeat(70)}` }),
    { status: 400 },
  );
});

test("blocks admin-management requests from regular admins", () => {
  let nextCalled = false;
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  requireSuperAdmin(
    { user: { role: "Admin" } },
    response,
    () => {
      nextCalled = true;
    },
  );

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.success, false);
  assert.equal(nextCalled, false);
});

test("allows admin-management requests from super admins", () => {
  let nextCalled = false;
  requireSuperAdmin(
    { user: { role: "Super Admin" } },
    {},
    () => {
      nextCalled = true;
    },
  );

  assert.equal(nextCalled, true);
});
