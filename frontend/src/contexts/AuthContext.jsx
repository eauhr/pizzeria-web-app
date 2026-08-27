import { createContext, useCallback, useContext, useState } from "react";
import apiClient from "@/lib/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  const checkUserAuth = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setUser(null);
      setAuthError(null);
      setLoading(false);
      setAuthChecked(true);
      return;
    }
    setLoading(true);
    try {
      const data = await apiClient.get("/auth/me");
      setUser(data.user ?? data);
      setAuthError(null);
    } catch (error) {
      localStorage.removeItem("auth_token");
      setUser(null);
      setAuthError({ type: "unauthenticated", message: error.message });
    } finally {
      setLoading(false);
      setAuthChecked(true);
    }
  }, []);

  async function login(email, password) {
    const data = await apiClient.post("/auth/login", { email, password });
    if (data.token) localStorage.setItem("auth_token", data.token);
    setUser(data.user ?? null);
    setAuthError(null);
    setAuthChecked(true);
    return data;
  }

  async function register({ name, email, password }) {
    return apiClient.post("/auth/register", { name, email, password });
  }

  async function verifyOtp({ email, otpCode }) {
    const data = await apiClient.post("/auth/verify-otp", { email, otp: otpCode });
    if (data.token) localStorage.setItem("auth_token", data.token);
    setUser(data.user ?? null);
    setAuthError(null);
    setAuthChecked(true);
    return data;
  }

  async function resendOtp(email) {
    return apiClient.post("/auth/resend-otp", { email });
  }

  async function resetPasswordRequest(email) {
    return apiClient.post("/auth/forgot-password", { email });
  }

  async function resetPassword({ resetToken, newPassword }) {
    return apiClient.post("/auth/reset-password", { token: resetToken, password: newPassword });
  }

  function logout() {
    localStorage.removeItem("auth_token");
    setUser(null);
    setAuthError(null);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoadingAuth: loading,
    authChecked,
    authError,
    checkUserAuth,
    login,
    register,
    verifyOtp,
    resendOtp,
    resetPasswordRequest,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

export default AuthContext;