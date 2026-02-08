/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axiosClient from "../axiosClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = Cookies.get("CLIENT_ACCESS_TOKEN");
      if (savedToken) {
        setToken(savedToken);
        try {
          const response = await axiosClient.get("/api/user/profile");
          if (response.data?.status === 200 && response.data?.data) {
            setUser(response.data.data);
          }
        } catch (error) {
          console.error("Auth init error:", error);
          Cookies.remove("CLIENT_ACCESS_TOKEN");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (newToken, userData) => {
    Cookies.set("CLIENT_ACCESS_TOKEN", newToken, { expires: 7 });
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    Cookies.remove("CLIENT_ACCESS_TOKEN");
    setToken(null);
    setUser(null);
  };
  const refreshUser = async () => {
    try {
      const response = await axiosClient.get("/api/user/profile");
      if (response.data?.status === 200 && response.data?.data) {
        setUser(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
