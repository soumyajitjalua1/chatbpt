import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchWithCredentials } from '@/utils/api'; // Import from utils

interface User {
  _id: string; // Changed from id to _id to match MongoDB
  name: string;
  email: string;
  subscriptionTier: 'free' | 'premium';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>; // Make logout async
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading until status check is done
  const { toast } = useToast();

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const userData = await fetchWithCredentials('/api/auth/status');
        if (userData) {
          setUser(userData);
        } else {
            setUser(null); // Ensure user is null if status check fails or returns no user
        }
      } catch (error) {
        // It's normal to get a 401 if not logged in, don't show an error toast
        console.info('User not logged in or session expired.');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await fetchWithCredentials('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setUser(userData);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error; // Re-throw the error so the component can handle it (e.g., clear form)
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await fetchWithCredentials('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      setUser(userData);
      toast({
        title: "Account created",
        description: "Welcome to ChatBPT!",
      });
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({
        title: "Signup failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
      throw error; // Re-throw the error
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
      // No need to set loading state for logout typically
    try {
      await fetchWithCredentials('/api/auth/logout', { method: 'POST' });
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      // Optionally clear other related state here if needed
    } catch (error: any) {
        console.error('Logout failed:', error);
        toast({
            title: "Logout failed",
            description: error.message || "Could not log out. Please try again.",
            variant: "destructive",
        });
        // Even if API call fails, force frontend logout
        setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !isLoading && !!user, // Only authenticated if not loading and user exists
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}
