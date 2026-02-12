/**
 * @fileoverview Test suite for the Express application.
 * This file contains integration tests for routes, middleware mocks,
 * and protected endpoints. It ensures that the backend behaves correctly
 * under different scenarios such as authentication, role-based access,
 * and error handling.
 * @module __tests__/app.test
 */

import request from "supertest";
import { app } from "../app.js";

/**
 * Mock for authentication middleware.
 * Simulates an authenticated user with a configurable role.
 * @module authMiddlewareMock
 */

jest.mock('firebase-admin');

jest.mock("../middleware/authMiddleware.js", () => ({
  auth: (req, res, next) => {
    req.user = { username: "testuser", role: req.headers["x-role"] || "USER" };
    next();
  },
}));

/**
 * Mock for role-checking middleware.
 * Ensures that only allowed roles can access certain routes.
 * @module checkRoleMock
 */
jest.mock("../middleware/checkRole.js", () => ({
  checkRole: (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  },
}));

/**
 * Mock for origin validation middleware.
 * Always passes validation in test environment.
 * @module validateOriginMock
 */
jest.mock("../middleware/validateOrigin.js", () => ({
  validateOrigin: (req, res, next) => next(),
}));

/**
 * Mock for smart origin validator middleware.
 * Always passes validation in test environment.
 * @module smartOriginValidatorMock
 */
jest.mock("../middleware/smartOriginValidator.js", () => ({
  smartOriginValidator: (req, res, next) => next(),
}));

/**
 * Test suite for Express application routes.
 */
describe("Express app", () => {
  /**
   * Root route test.
   * Should return welcome message.
   */
  test("GET / returns welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Welcome to the secure and monitored platform.");
  });

  /**
   * API route test.
   * Should return pong message 🚀.
   */
  test("GET /api returns pong", async () => {
    const res = await request(app).get("/api");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "pong from Express backend 🚀" });
  });

  /**
   * Health check route test.
   * Should return status ok.
   */
  test("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  /**
   * Protected route tests for /admin-only.
   */
  describe("Protected route /admin-only", () => {
    test("without authentication defaults to USER role and returns 403", async () => {
      const res = await request(app).get("/admin-only");
      expect(res.statusCode).toBe(403);
    });

    test("with non-ADMIN role returns 403", async () => {
      const res = await request(app).get("/admin-only").set("x-role", "MANAGER");
      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({ error: "Forbidden" });
    });

    test("with ADMIN role returns access", async () => {
      const res = await request(app).get("/admin-only").set("x-role", "ADMIN");
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("Hi testuser, you have admin access 🔑");
    });
  });

  /**
   * Non-existent API route test.
   * Should return specific error message.
   */
  test("non-existent route under /api returns specific error", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Route /api not found" });
  });

  /**
   * Global non-existent route test.
   * Should return generic error message.
   */
  test("global non-existent route returns generic error", async () => {
    const res = await request(app).get("/no-such-route");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Route not found" });
  });
});
