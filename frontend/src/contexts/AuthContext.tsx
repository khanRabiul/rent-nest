"use client";

import { createContext, useState, useEffect, useContext } from "react";
import authService from "@/services/authService";
import { useRouter } from "next/navigation";

// user data interface
interface IFrontendUser {
  id: string;
  username: string;
  email: string;
  role: "user" | "landlord" | "admin";
  fullName?: string | null;
  profilePicture?: string | null;
  savedProperties?: string[];
}

// 1. AuthContext - Type
interface IAuthContextType {
  user: IFrontendUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<IFrontendUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
        if (decodedToken.exp * 1000 > Date.now()) {
          const userData: IFrontendUser = {
            id: decodedToken.id,
            username: decodedToken.username || "Guest",
            email: decodedToken.email || "",
            role: decodedToken.role || "user",
            fullName: decodedToken.fullName || null,
            profilePicture: decodedToken.profilePicture || null,
            savedProperties: decodedToken.savedProperties || [],
          };
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
      setIsLoading(false);
    };
    loadUserFromToken();
  }, []);

  // 4. Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user as IFrontendUser);
      setIsLoggedIn(true);
      return res.data;
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Register function
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const res = await authService.register(userData);
      return res.data;
    } catch (error: any) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 6. Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    router.push("/signin");
  };

  // 7. AuthContext.Provider 
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};