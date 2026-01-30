// src/services/auth.js
import apiClient from "@/lib/apiClient";
import storage from "@/lib/storage";

/**
 * LOGIN USER
 * @param {Object} payload - { username/email, password }
 * @param {boolean} isWordPressLogin - whether this is a WP redirect login
 * @returns {Object} - { token, user, ... }
 */
export const loginUser = async (payload, isWordPressLogin = false) => {
  try {
    // Transform email to username if email is provided
    const loginPayload = {
      username: payload.username,
      password: payload.password
    };
    const { data } = await apiClient.post("/public/signin", loginPayload);
    
    // Mark response with WP context if needed
    if (isWordPressLogin) {
      data._isWordPressLogin = true;
    }
    
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Login failed. Please try again.";
    throw new Error(message);
  }
};

/**
 * REGISTER USER
 * @param {Object} userData - { email, password, firstName, lastName, ... }
 * @param {boolean} isWordPressRegister - whether this is a WP redirect registration
 * @returns {Object} - { user, token, ... }
 */
export const registerUser = async (userData, isWordPressRegister = false) => {
  try {
    const { data } = await apiClient.post("/public/signup", userData);
    console.debug('[auth] registerUser response:', data);
    
    // Mark response with WP context if needed
    if (isWordPressRegister) {
      data._isWordPressRegister = true;
    }
    
    return data;
  } catch (error) {
    // Log error details for easier debugging
    console.error('[auth] registerUser error:', error?.response?.status, error?.response?.data || error.message);
    // Detect common server-side duplicate-query error and provide a clearer error
    const serverMessage = error?.response?.data?.message || error?.response?.data || '';
    if (typeof serverMessage === 'string' && serverMessage.includes('NonUniqueResultException')) {
      const e = new Error('Server error: duplicate user records detected. Please contact support.');
      e.isServerDupError = true;
      throw e;
    }
    if (error.response?.data?.errors) {
      // Backend validation errors
      const e = new Error(JSON.stringify(error.response.data.errors));
      e.isValidationError = true;
      throw e;
    }
    // If we flagged email-taken earlier, pass that through
    if (error.isEmailTakenError) throw error;

    // If server returned 409 or a message, surface it
    if (error.response?.status === 409) {
      const e = new Error('This email address is already registered.');
      e.isEmailTakenError = true;
      throw e;
    }

    const message = error.response?.data?.message || "Registration failed.";
    const e = new Error(message);
    e.isRegistrationError = true;
    throw e;
  }
};

/**
 * GET CONNECTED USER
 * Fetch the currently logged-in user
 * @returns {Object} - user object
 */
export const getConnectedUser = async () => {
  try {
    const { data } = await apiClient.get("/users");
    return data;
  } catch (error) {
    throw new Error("Failed to fetch connected user");
  }
};

/**
 * LOGOUT USER
 * Clears token and user from storage
 */
export const logoutUser = () => {
  try {
    storage.clearAuth();
  }catch (err) {
    console.warn("Failed to clear session storage:", err);
  }
};