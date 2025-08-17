"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import AuthService from "@/lib/api/services/auth";
import { TokenManager } from "@/lib/api/client";
import ErrorHandler from "@/lib/utils/errorHandler";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    address?: string,
    dateOfBirth?: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Login user with email and password
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await AuthService.login({ email, password });

      if (response.success && response.token && response.user) {
        const { user: userData, token } = response;

        // Store token
        TokenManager.setToken(token);

        // Transform API user to local User type
        const localUser: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          isEmailVerified: userData.isEmailVerified ?? false,
          createdAt: userData.createdAt ?? new Date().toISOString(),
          updatedAt: userData.updatedAt ?? new Date().toISOString(),
          appointments: [], // Will be loaded separately when needed
        };

        setUser(localUser);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      ErrorHandler.logError(error, "AuthContext.login");
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Register new user
   */
  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    address?: string,
    dateOfBirth?: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await AuthService.register({
        email,
        password,
        name,
        phone,
        role: "patient", // Always patient for signup page
        address,
        dateOfBirth,
      });

      if (response.success) {
        // Registration successful - user needs to verify email
        // Don't log them in automatically, just return success
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      ErrorHandler.logError(error, "AuthContext.register");
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // Since backend doesn't have logout endpoint, handle locally
      await AuthService.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      ErrorHandler.logError(error, "AuthContext.logout");
    } finally {
      // Clear local state and tokens
      setUser(null);
      TokenManager.clearTokens();
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);

    try {
      const response = await AuthService.updateProfile(userData);

      if (response.success && response.data) {
        const updatedUser: User = {
          ...user,
          ...response.data,
          appointments: user.appointments, // Preserve appointments
        };

        setUser(updatedUser);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      ErrorHandler.logError(error, "AuthContext.updateProfile");
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Validate and restore user session on app start
   */
  const initializeAuth = async () => {
    const token = TokenManager.getToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Validate token and get user data
      const response = await AuthService.validateToken();

      if (response.success && response.data?.valid && response.data.user) {
        const userData = response.data.user;
        const localUser: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          role: userData.role,
          isEmailVerified: userData.isEmailVerified ?? false,
          createdAt: userData.createdAt ?? new Date().toISOString(),
          updatedAt: userData.updatedAt ?? new Date().toISOString(),
          appointments: [],
        };

        setUser(localUser);
      } else {
        // Invalid token, clear storage
        TokenManager.clearTokens();
      }
    } catch (error) {
      // Token validation failed, clear storage
      ErrorHandler.logError(error, "AuthContext.initializeAuth");
      TokenManager.clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
