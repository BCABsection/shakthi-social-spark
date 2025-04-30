
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  username: string;
  fullName: string;
  profileImage: string;
  bio?: string;
  followers: number;
  following: number;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, fullName: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - in a real app, this would come from Firebase
const MOCK_USERS = [
  {
    id: '1',
    username: 'john_doe',
    fullName: 'John Doe',
    password: 'password123',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Digital creator | Travel enthusiast',
    followers: 542,
    following: 231
  },
  {
    id: '2',
    username: 'jane_smith',
    fullName: 'Jane Smith',
    password: 'password123',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Photographer | Nature lover',
    followers: 1024,
    following: 156
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isAuthenticated = !!currentUser;

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('shakthi_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user', error);
        localStorage.removeItem('shakthi_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shakthi_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    
    if (user) {
      // Omit password from user object
      const { password, ...safeUserData } = user;
      setCurrentUser(safeUserData);
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.username}`,
      });
      setIsLoading(false);
      return true;
    } else {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Invalid username or password',
      });
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (username: string, fullName: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = MOCK_USERS.find(u => u.username === username);
    
    if (existingUser) {
      toast({
        variant: 'destructive',
        title: 'Signup failed',
        description: 'Username already exists',
      });
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `${MOCK_USERS.length + 1}`,
      username,
      fullName,
      profileImage: `https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}&background=random`,
      bio: '',
      followers: 0,
      following: 0
    };
    
    // In a real app, we'd save this to Firebase
    setCurrentUser(newUser);
    toast({
      title: 'Account created!',
      description: `Welcome to Shakthi, ${fullName}!`,
    });
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('shakthi_user');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      isLoading,
      login, 
      signup,
      logout
    }}>
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
