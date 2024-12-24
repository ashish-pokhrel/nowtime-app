import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";

type AuthContextType = {
  user: any;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Simulate fetching user data based on token
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get("/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch (err) {
          console.error("Failed to fetch user", err);
          logout();
        }
      }
    };
    fetchUser();
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
    // Store token in HTTP-only cookies (or in memory for client-side only apps)
    document.cookie = `token=${newToken}; HttpOnly; Secure`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
