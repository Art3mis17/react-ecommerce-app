import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginCredentials } from '../models/types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  /** true for admin sessions — gates admin-only routes and UI. */
  isAdmin: boolean;
  /** Synchronous admin login — compares against demo credentials. */
  login: (credentials: LoginCredentials) => { success: boolean; message: string };
  /**
   * Asynchronous customer login via DummyJSON.
   * Any valid DummyJSON user works (e.g. emilys / emilyspass).
   */
  loginAsCustomer: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

/** Hardcoded admin — for demo purposes only. Credentials: admin / admin */
const DEMO_ADMIN_USER: User = {
  id: 1,
  username: 'admin',
  email: 'admin@cartcrazy.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
};

const STORAGE_KEY = 'cartcrazy_user';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as User) : null;
  });

  const isAuthenticated = currentUser !== null;
  const isAdmin = currentUser?.role === 'admin';

  // Keep localStorage in sync whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  const login = (credentials: LoginCredentials): { success: boolean; message: string } => {
    if (
      credentials.username === DEMO_ADMIN_USER.username &&
      credentials.password === credentials.username
    ) {
      setCurrentUser(DEMO_ADMIN_USER);
      return { success: true, message: 'Login successful!' };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  /**
   * Async customer login via DummyJSON API.
   * On success the user is stored with role = 'customer'.
   */
  const loginAsCustomer = async (
    username: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, expiresInMins: 30 }),
      });
      if (!res.ok) {
        return { success: false, message: 'Invalid username or password' };
      }
      const data = await res.json();
      const user: User = {
        id: data.id,
        username: data.username,
        email: data.email ?? `${data.username}@cartcrazy.com`,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'customer',
      };
      setCurrentUser(user);
      return { success: true, message: 'Welcome! Redirecting…' };
    } catch {
      return { success: false, message: 'Invalid username or password' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated, isAdmin, login, loginAsCustomer, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for convenient access to auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthContextProvider');
  }
  return context;
};
