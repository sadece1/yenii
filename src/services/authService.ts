import api from './api';
import { AuthResponse, LoginForm, RegisterForm, User } from '@/types';

// Mock users for testing (matches backend seed data)
const mockUsers = [
  {
    id: '1',
    email: 'admin@campscape.com',
    name: 'Admin User',
    role: 'admin' as const,
    password: 'Admin123!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user1@campscape.com',
    name: 'John Doe',
    role: 'user' as const,
    password: 'User123!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'user2@campscape.com',
    name: 'Jane Smith',
    role: 'user' as const,
    password: 'User123!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Frontend-only mode: Store registered users in localStorage
const USERS_STORAGE_KEY = 'campscape_users';

const getStoredUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load users from storage:', error);
  }
  // Initialize with mock users
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
  return mockUsers;
};

const saveUsers = (users: typeof mockUsers) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to storage:', error);
  }
};

export const authService = {
  async login(credentials: LoginForm): Promise<AuthResponse> {
    // Frontend-only mode: Always use mock data
    const users = getStoredUsers();
    const user = users.find(
      (u: typeof mockUsers[0]) => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('E-posta veya şifre hatalı');
    }

    // Return mock response
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword as User,
      token: `mock-token-${user.id}`,
    };
  },

  async register(data: RegisterForm): Promise<AuthResponse> {
    // Frontend-only mode: Store in localStorage
    const users = getStoredUsers();
    
    // Check if user already exists
    if (users.find((u: typeof mockUsers[0]) => u.email === data.email)) {
      throw new Error('Bu e-posta adresi zaten kullanılıyor');
    }

    // Create new user
    const newUser = {
      id: `${Date.now()}`,
      email: data.email,
      name: data.name,
      role: 'user' as const,
      password: data.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const { password, ...userWithoutPassword } = newUser;
    return {
      user: userWithoutPassword as User,
      token: `mock-token-${newUser.id}`,
    };
  },

  async getCurrentUser(): Promise<User> {
    // Frontend-only mode: Get from auth store token
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) {
      throw new Error('Not authenticated');
    }

    const { state } = JSON.parse(authStorage);
    if (!state?.token) {
      throw new Error('Not authenticated');
    }

    // Extract user ID from mock token
    const userId = state.token.replace('mock-token-', '');
    const users = getStoredUsers();
    const user = users.find((u: typeof mockUsers[0]) => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    // Frontend-only mode: Update in localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) {
      throw new Error('Not authenticated');
    }

    const { state } = JSON.parse(authStorage);
    const userId = state.token.replace('mock-token-', '');
    const users = getStoredUsers();
    const userIndex = users.findIndex((u: typeof mockUsers[0]) => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveUsers(users);

    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword as User;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    // Frontend-only mode: Update password in localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) {
      throw new Error('Not authenticated');
    }

    const { state } = JSON.parse(authStorage);
    const userId = state.token.replace('mock-token-', '');
    const users = getStoredUsers();
    const userIndex = users.findIndex((u: typeof mockUsers[0]) => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Verify current password
    if (users[userIndex].password !== currentPassword) {
      throw new Error('Mevcut şifre hatalı');
    }

    // Update password
    users[userIndex].password = newPassword;
    users[userIndex].updatedAt = new Date().toISOString();
    saveUsers(users);
  },

  async getAllUsers(): Promise<User[]> {
    // Frontend-only mode: Return all users from localStorage
    const users = getStoredUsers();
    return users.map(({ password, ...user }: typeof mockUsers[0]) => user as User);
  },
};

