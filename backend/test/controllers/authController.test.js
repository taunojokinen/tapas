const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully with valid credentials", async () => {
      const mockUser = {
        _id: "123",
        username: "testuser",
        password: await bcrypt.hash("password123", 10),
        role: "user",
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("role", "user");
    });

    it("should fail with wrong password", async () => {
      const mockUser = {
        username: "testuser",
        password: await bcrypt.hash("correct", 10),
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app).post("/api/auth/login").send({
        username: "testuser",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/Invalid username or password/);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should logout successfully with valid token", async () => {
      const token = "valid.jwt.token";

      // Mock jwt.verify palauttamaan käyttäjäobjekti
      jest.spyOn(jwt, "verify").mockImplementation(() => ({
        id: "user123",
        username: "testuser",
        role: "user"
      }));

      // Aseta token aktiiviseksi ennen pyyntöä
      activeTokens.set(token, {
        username: "testuser",
        role: "user",
        loginTime: new Date()
      });

      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/Logout successful/);
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
      
        // Käytetään jest.fn() mockataksesi bcrypt.compare
        bcrypt.compare = jest.fn().mockResolvedValue(false);
      
        await changePassword(req, res);
      
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Old password is incorrect" });
      });
      

      it("should change password and return 200", async () => {
        const mockUser = {
          password: "hashedOldPassword",
          save: jest.fn() // Mokkaa save-metodin
        };
      
        jwt.verify.mockReturnValue({ id: "123" });
        User.findById.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
      
        // Mockataan bcrypt.hash palauttamaan uusi salattu salasana
        bcrypt.hash = jest.fn().mockResolvedValue("newHashedPassword");
      
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

// Initialize activeTokens before the tests
beforeAll(() => {
  app.locals.activeTokens = new Map();
});

describe("GET /api/auth/loggedInUsers", () => {
    it("should return an empty list when there are no logged-in users", async () => {
      // Clear the activeTokens map to ensure no users are logged in
      app.locals.activeTokens.clear();
  
      const response = await request(app).get("/api/auth/loggedInUsers");
  
      expect(response.status).toBe(200); // Expect 200 status
      expect(response.body.loggedInUsers).toEqual([]); // Expect empty list
    });
  
    it("should return a list of logged-in users when there are active users", async () => {
      const mockUsers = [
        { username: "user1", loginTime: new Date("2025-04-10T10:00:00Z") },
        { username: "user2", loginTime: new Date("2025-04-10T11:00:00Z") }
      ];
  
      // Ensure we start with an empty map to avoid leftover data from previous tests
      app.locals.activeTokens.clear();
  
      // Simulate logged-in users
      mockUsers.forEach(user => {
        app.locals.activeTokens.set(`token_${user.username}`, user);
      });
  
      const response = await request(app).get("/api/auth/loggedInUsers");
  
      app.locals.activeTokens.clear();
      expect(response.status).toBe(200);
      expect(response.body.loggedInUsers).toEqual([
        {
          username: "user1",
          loginTime: mockUsers[0].loginTime.toISOString(), // Make sure loginTime is in ISO format
        },
        {
          username: "user2",
          loginTime: mockUsers[1].loginTime.toISOString(), // Make sure loginTime is in ISO format
        },
      ]);
    });
  });
});
