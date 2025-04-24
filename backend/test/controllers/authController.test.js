const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const activeTokens = require("../../utils/activeTokens"); // Oletetaan, että tämä on oikea polku

jest.mock("../../models/Userlist"); // Mockataan Mongoosen malli
const User = require("../../models/Userlist");

const { login, logout, changePassword, getLoggedInUsers } = require("../../controllers/authController");
const { JWT_SECRET } = require("../../config");

const app = express();
app.use(express.json());
app.post("/api/auth/login", login);
app.post("/api/auth/logout", logout);
app.post("/api/auth/changePassword", changePassword);

// Mock bcrypt methods globally
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn()
}));

// Mock jwt.verify globally
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn()
}));
jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
    verify: jest.fn()
  }));
  
describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Clear activeTokens before each test
  beforeEach(() => {
    app.locals.activeTokens = new Map();
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
        const mockUser = {
          _id: "123",
          username: "testuser",
          password: "hashedPassword123",
          role: "user",
        };
      
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mock.jwt.token"); // <- Important!
      
        const response = await request(app).post("/api/auth/login").send({
          username: "testuser",
          password: "password123",
        });
      
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token", "mock.jwt.token");
        expect(response.body).toHaveProperty("role", "user");
      });
      

      it("should fail with wrong password", async () => {
        const mockUser = {
          username: "testuser",
          password: "hashedPassword123",
        };
      
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false); // Wrong password
        jwt.sign.mockReturnValue("mock.jwt.token"); // Safe to include if controller calls this before returning
      
        const response = await request(app).post("/api/auth/login").send({
          username: "testuser",
          password: "wrongpassword",
        });
      
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/Invalid username or password/);
      });
      
  });

  describe("POST /api/auth/logout", () => {
    const validToken = "valid.jwt.token";
  
    beforeEach(() => {
      app.locals.activeTokens = new Map();
    });
  
    it("should return 401 if no Authorization header", async () => {
      const response = await request(app).post("/api/auth/logout");
      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/Missing token/);
    });
  
    it("should return 401 if token is invalid", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });
  
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", "Bearer invalid.token");
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid token");
    });
  
    it("should return 200 if token is expired", async () => {
      jwt.verify.mockImplementation(() => {
        const err = new Error("jwt expired");
        err.name = "TokenExpiredError";
        throw err;
      });
  
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${validToken}`);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/token expired/i);
    });
  
    it("should logout successfully with valid token in activeTokens", async () => {
      jwt.verify.mockReturnValue({ id: "user123", username: "testuser" });
  
      app.locals.activeTokens.set(validToken, {
        username: "testuser",
        loginTime: new Date()
      });
  
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${validToken}`);
  
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/Logout successful/);
      expect(app.locals.activeTokens.has(validToken)).toBe(false); // token removed
    });
  
    it("should return 400 if token not found in activeTokens", async () => {
      jwt.verify.mockReturnValue({ id: "user123", username: "testuser" });
  
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${validToken}`);
  
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/Invalid or expired token/);
    });
  
    it("should return 500 if an unexpected error occurs", async () => {
      jwt.verify.mockReturnValue({ id: "user123", username: "testuser" });
  
      // Force activeTokens.has to throw an error
      const originalHas = app.locals.activeTokens.has;
      app.locals.activeTokens.has = () => { throw new Error("Unexpected crash"); };
  
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${validToken}`);
  
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal server error");
  
      // Restore the original method
      app.locals.activeTokens.has = originalHas;
    });
  });
  

  describe("POST /api/auth/changePassword", () => {
    let req, res;

    beforeEach(() => {
      req = {
        headers: {
          authorization: "Bearer fakeToken"
        },
        body: {
          oldPassword: "old123",
          newPassword: "new456"
        }
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });

    it("should return 401 if no auth header", async () => {
      req.headers.authorization = null;

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 400 if passwords are missing", async () => {
      req.body = {};

      jwt.verify.mockReturnValue({ id: "123" });

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Old and new passwords are required" });
    });

    it("should return 404 if user not found", async () => {
      jwt.verify.mockReturnValue({ id: "123" });
      User.findById.mockResolvedValue(null);

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 401 if old password is incorrect", async () => {
      jwt.verify.mockReturnValue({ id: "123" });
      User.findById.mockResolvedValue({ password: "hashedOldPassword" });

      // Mock bcrypt.compare to return false
      bcrypt.compare.mockResolvedValue(false);

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Old password is incorrect" });
    });

    it("should change password and return 200", async () => {
      const mockUser = {
        password: "hashedOldPassword",
        save: jest.fn() // Mock save method
      };

      jwt.verify.mockReturnValue({ id: "123" });
      User.findById.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);

      // Mock bcrypt.hash to return a new hashed password
      bcrypt.hash.mockResolvedValue("newHashedPassword");

      await changePassword(req, res);

      expect(mockUser.password).toBe("newHashedPassword");
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Password changed successfully" });
    });

    it("should return 500 on error", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("Token error");
      });

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  // Define the route for getting logged-in users
  app.get("/api/auth/loggedInUsers", getLoggedInUsers);

  beforeAll(() => {
    // Initialize activeTokens as a Map before any tests
    app.locals.activeTokens = new Map();
    console.log("Active tokens initialized:", app.locals.activeTokens);  // Check if this log shows up
  });
   describe("GET /api/auth/loggedInUsers", () => {
    it("should return an empty list when there are no logged-in users", async () => {
      // Clear the activeTokens map to ensure no users are logged in
      app.locals.activeTokens.clear();
  
      // Log before making the request
      console.log("Active tokens before request:", app.locals.activeTokens);
  
      const response = await request(app).get("/api/auth/loggedInUsers");
  
      // Log after receiving the response
      console.log("Active tokens after request:", app.locals.activeTokens);
  
      expect(response.status).toBe(200); // Expect 200 status
      expect(response.body.loggedInUsers).toEqual([]); // Expect empty list
    });
  
    it("should return a list of logged-in users when there are active users", async () => {
        const mockUsers = [
          { username: "user1", loginTime: new Date("2025-04-10T10:00:00Z") },
          { username: "user2", loginTime: new Date("2025-04-10T11:00:00Z") }
        ];
      
        // Clear activeTokens to ensure a clean state
        app.locals.activeTokens.clear();
      
        // Add mock users to activeTokens
        mockUsers.forEach(user => {
          app.locals.activeTokens.set(`token_${user.username}`, user);
        });
      
        // Log activeTokens before making the request to check the data
        console.log("Active tokens before request:", app.locals.activeTokens);
      
        const response = await request(app).get("/api/auth/loggedInUsers");
      
        // Log the response body
        console.log("Response body:", response.body);
      
        expect(response.status).toBe(200);
        expect(response.body.loggedInUsers).toEqual([
          {
            username: "user1",
            loginTime: mockUsers[0].loginTime.toISOString(),
          },
          {
            username: "user2",
            loginTime: mockUsers[1].loginTime.toISOString(),
          },
        ]);
      });
  }); 
});
