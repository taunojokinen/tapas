import { renderHook } from "@testing-library/react-hooks"; // Updated to import act from 'react'
import useAuth from "../../src/hooks/useAuth"; // Adjust the import path as necessary
import { act } from "react";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(global, "localStorage", { value: mockLocalStorage });

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should handle login successfully", async () => {
    // Mock successful API response
    const fakeToken = "fakeToken";
    const fakeUsername = "testUser";

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: fakeToken, role: "user" }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.handleLogin(fakeUsername, "password");
    });

    // Check if the token and username are set correctly
    expect(result.current.token).toBe(fakeToken);
    expect(result.current.username).toBe(fakeUsername);
    expect(localStorage.setItem).toHaveBeenCalledWith("token", fakeToken);
    expect(localStorage.setItem).toHaveBeenCalledWith("username", fakeUsername);
    expect(localStorage.setItem).toHaveBeenCalledWith("role", "user");
    expect(result.current.error).toBe(""); // No errors
  });

  it("should handle logout successfully", async () => {
    // Mock logout API response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Logged out successfully" }),
    });

    // Set initial state to simulate a logged-in user
    mockLocalStorage.getItem
      .mockReturnValueOnce("fakeToken")
      .mockReturnValueOnce("testUser");

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.handleLogout();
    });

    // Check if token and username are cleared after logout
    expect(result.current.token).toBe("");
    expect(result.current.username).toBe("");
    expect(result.current.error).toBe(""); // Error should be cleared on success

    // Assert that localStorage.removeItem was called for token and username
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("username");

    // Check if fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/auth/logout`,
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer fakeToken", // Ensure the Authorization header contains the token
        },
      })
    );
  });

  it("should handle failed logout", async () => {
    // Mock failed logout API response
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Logout failed" }),
    });

    // Set initial state to simulate a logged-in user
    mockLocalStorage.getItem
      .mockReturnValueOnce("fakeToken")
      .mockReturnValueOnce("testUser");

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.handleLogout();
    });

    // Ensure that the error is set correctly
    expect(result.current.error).toBe("Logout failed");

    // Ensure token and username are not cleared on error
    expect(result.current.token).toBe("fakeToken");
    expect(result.current.username).toBe("testUser");

    // Check if localStorage.removeItem was NOT called on failure
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  });
});
