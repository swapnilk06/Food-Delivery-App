import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = "https://api.freeapi.app/api/v1";
const TOKEN_KEY = "@swapnil_cafe_token"; // Personalized storage key

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          setToken(storedToken);
          await fetchUserProfile(storedToken);
        } else {
          setIsLoading(false);
        }
      } catch (e) {
        setIsLoading(false);
      }
    };
    bootstrapAsync();
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/current-user`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const json = await response.json();
      if (response.ok && json.success) {
        setUser(json.data);
      } else {
        await performCleanLogout();
      }
    } catch (e) {
      console.warn("Profile fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => { if (token) await fetchUserProfile(token); };

  const performCleanLogout = async () => {
    try { await AsyncStorage.removeItem(TOKEN_KEY); } catch (e) {}
    setToken(null);
    setUser(null);
  };

  const register = async (username: string, email: string, password: string, fullName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ username, email, password, fullName }),
      });
      const json = await response.json();
      return { success: response.ok, error: response.ok ? undefined : json.message };
    } catch (e) {
      return { success: false, error: "Network error" };
    }
  };

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const isEmail = emailOrUsername.includes("@");
      const payload: Record<string, string> = { password, [isEmail ? "email" : "username"]: emailOrUsername };
      
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      if (response.ok && json.success) {
        await AsyncStorage.setItem(TOKEN_KEY, json.data.accessToken);
        setToken(json.data.accessToken);
        setUser(json.data.user);
        return { success: true };
      }
      return { success: false, error: json.message };
    } catch (e) {
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await performCleanLogout();
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, isLoggedIn: !!token && !!user, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};