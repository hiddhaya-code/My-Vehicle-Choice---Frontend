import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { fullName: string; email: string; password: string; phone?: string; city?: string }) => Promise<void>;
  logout: () => void;
  wishlistVehicleIds: number[];
  isWishlisted: (vehicleId: number) => boolean;
  toggleWishlist: (vehicleId: number) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mvc_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mvc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [wishlistVehicleIds, setWishlistVehicleIds] = useState<number[]>([]);

  const refreshUserProfile = async () => {
    if (!token) return;
    try {
      const profile = await api.getMe();
      setUser({
        id: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        role: profile.role as 'ROLE_USER' | 'ROLE_ADMIN',
        phone: profile.phone,
        city: profile.city,
      });
      setWishlistVehicleIds(profile.wishlistVehicleIds || []);
    } catch (err) {
      console.warn('Failed to refresh user profile, session may have expired:', err);
      logout();
    }
  };

  useEffect(() => {
    if (token) {
      refreshUserProfile();
    } else {
      setUser(null);
      setWishlistVehicleIds([]);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const authRes = await api.login({ email, password });
    const userObj: User = authRes.user || {
      id: authRes.id,
      email: authRes.email,
      fullName: authRes.fullName,
      role: authRes.role as 'ROLE_USER' | 'ROLE_ADMIN',
    };
    localStorage.setItem('mvc_token', authRes.token);
    localStorage.setItem('mvc_user', JSON.stringify(userObj));
    setToken(authRes.token);
    setUser(userObj);
    await refreshUserProfile();
  };

  const register = async (payload: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
  }) => {
    const authRes = await api.register(payload);
    const userObj: User = authRes.user || {
      id: authRes.id,
      email: authRes.email,
      fullName: authRes.fullName,
      role: authRes.role as 'ROLE_USER' | 'ROLE_ADMIN',
    };
    localStorage.setItem('mvc_token', authRes.token);
    localStorage.setItem('mvc_user', JSON.stringify(userObj));
    setToken(authRes.token);
    setUser(userObj);
    await refreshUserProfile();
  };

  const logout = () => {
    localStorage.removeItem('mvc_token');
    localStorage.removeItem('mvc_user');
    setToken(null);
    setUser(null);
    setWishlistVehicleIds([]);
  };

  const isWishlisted = (vehicleId: number) => {
    return wishlistVehicleIds.includes(vehicleId);
  };

  const toggleWishlist = async (vehicleId: number) => {
    if (!token) {
      alert('Please sign in to save vehicles to your wishlist');
      return;
    }
    try {
      if (isWishlisted(vehicleId)) {
        await api.removeFromWishlist(vehicleId);
        setWishlistVehicleIds(prev => prev.filter(id => id !== vehicleId));
      } else {
        await api.addToWishlist(vehicleId);
        setWishlistVehicleIds(prev => [...prev, vehicleId]);
      }
    } catch (err: any) {
      console.error('Wishlist action failed:', err);
    }
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        wishlistVehicleIds,
        isWishlisted,
        toggleWishlist,
        refreshUserProfile,
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
