"use client";
import api, { setAuthToken, refreshInstance } from "@/lib/api";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: (token) => {},
  logout: () => {},
  fetchUser: () => {},
  setAccessToken: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const router = useRouter();

  // --- Token Sync Bridge ---
  useEffect(() => {
    setAuthToken(accessToken);
  }, [accessToken]);

  // --- Logout Function ---
  const logout = useCallback(
    (shouldRedirect = true) => {
      setAccessToken(null);
      setUser(null);
      setIsAuthenticated(false);

      toast.success("Logged out successfully");

      api
        .post("/logout")
        .catch((err) => console.error("Logout request failed:", err));

      if (shouldRedirect) {
        router.push("/login");
      }
    },
    [router]
  );

  const login = async (token, message) => {
    toast.success(message);
    setAccessToken(token)
    setAuthToken(token)
    await fetchSession()
  };

  const fetchSession = async () => {
    try {
      const userRes = await api.get("/profile");
      setUser(userRes.data.user);
      console.log("profile set", userRes);
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    setAccessToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
