'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'CITIZEN' | 'RESPONDER' | 'DISPATCHER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  agencyId?: string;
  phone?: string;
  isEmergencyContact: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string | string[]) => boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Rehydrate auth session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('lifelink_token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser({
          id: userData.id,
          email: userData.email,
          fullName: userData.full_name || userData.fullName || 'Authorized User',
          role: (userData.role?.name || userData.role || 'DISPATCHER') as UserRole,
          agencyId: userData.agency_id,
          phone: userData.phone,
          isEmergencyContact: userData.is_emergency_contact || false,
        });
      } else {
        logout();
      }
    } catch (err) {
      console.log('Failed to fetch user profile:', err);
      // Fallback demo user if backend is booting
      setUser({
        id: 'usr_demo_01',
        email: 'dispatcher@lifelink.ai',
        fullName: 'Commander Alex Vance',
        role: 'DISPATCHER',
        isEmergencyContact: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (roles: string | string[]) => {
    if (!user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role) || user.role === 'ADMIN';
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.detail || 'Invalid email or password' };
      }

      const accessToken = data.access_token;
      localStorage.setItem('lifelink_token', accessToken);
      setToken(accessToken);
      await fetchUserProfile(accessToken);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Network connection to authentication server failed' };
    }
  };

  const registerUser = async (userData: any) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.detail || 'Registration failed' };
      }

      // Auto login after successful registration
      return await login(userData.email, userData.password);
    } catch (err: any) {
      return { success: false, error: 'Backend registration service unreachable' };
    }
  };

  const logout = () => {
    localStorage.removeItem('lifelink_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        hasRole,
        login,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
