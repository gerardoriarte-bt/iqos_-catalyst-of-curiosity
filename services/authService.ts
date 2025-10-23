import { LoginCredentials, AuthResponse, User } from '../types';

// Mock users database (in production, this would be in a real database)
const USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@iqos.com',
    password: 'SecureAdmin2024!', // Temporary plain text for testing
    role: 'admin' as const,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'marketing',
    email: 'marketing@iqos.com',
    password: 'MarketingPro2024!', // Temporary plain text for testing
    role: 'user' as const,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Simple JWT-like token generation (in production, use a proper JWT library)
const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  return btoa(JSON.stringify(payload));
};

// Verify token
const verifyToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) {
      return null; // Token expired
    }
    
    const user = USERS.find(u => u.id === payload.id);
    if (!user) return null;
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  } catch {
    return null;
  }
};

// Login function
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = USERS.find(u => u.username === credentials.username);
  
  if (!user) {
    return {
      success: false,
      message: 'Invalid username or password'
    };
  }
  
  // In production, use bcrypt to compare hashed passwords
  // For now, we'll use a simple comparison for testing
  const isValidPassword = user.password === credentials.password;
  
  if (!isValidPassword) {
    return {
      success: false,
      message: 'Invalid username or password'
    };
  }
  
  const userData: User = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
  
  const token = generateToken(userData);
  
  return {
    success: true,
    user: userData,
    token
  };
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('auth_token');
};

// Get current user from token
export const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  return verifyToken(token);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;
  
  return verifyToken(token) !== null;
};

// Store auth token
export const storeAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};
