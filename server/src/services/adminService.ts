import pool from '../config/database';
import { User } from '../types';
import { getPaginationParams, formatPagination, generateId } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';
import { hashPassword } from './authService';

export const getDashboardStats = async () => {
  const [userCount] = await pool.execute<Array<any>>('SELECT COUNT(*) as count FROM users');
  const [campsiteCount] = await pool.execute<Array<any>>('SELECT COUNT(*) as count FROM campsites');
  const [gearCount] = await pool.execute<Array<any>>('SELECT COUNT(*) as count FROM gear');
  const [reservationCount] = await pool.execute<Array<any>>('SELECT COUNT(*) as count FROM reservations');
  const [blogCount] = await pool.execute<Array<any>>('SELECT COUNT(*) as count FROM blog_posts');
  const [reviewCount] = await pool.execute<Array<any>>('SELECT COUNT(*) as count FROM reviews');

  return {
    users: userCount[0].count,
    campsites: campsiteCount[0].count,
    gear: gearCount[0].count,
    reservations: reservationCount[0].count,
    blogPosts: blogCount[0].count,
    reviews: reviewCount[0].count,
  };
};

export const getAllUsers = async (query: any) => {
  const { page, limit, offset } = getPaginationParams(query);
  const [countResult] = await pool.execute<Array<any>>('SELECT COUNT(*) as total FROM users');
  const total = countResult[0].total;

  const [users] = await pool.execute<Array<any>>(
    'SELECT id, email, name, avatar, role, is_active, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );

  return {
    data: users,
    pagination: formatPagination({ page, limit, total }),
  };
};

export const updateUserRole = async (id: string, role: 'user' | 'admin'): Promise<void> => {
  await pool.execute('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [role, id]);
};

export const deleteUser = async (id: string): Promise<void> => {
  await pool.execute('DELETE FROM users WHERE id = ?', [id]);
};

/**
 * Generate random password
 */
const generateRandomPassword = (): string => {
  const length = 12;
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Create user by admin
 */
export const createUserByAdmin = async (
  name: string,
  email: string,
  role: 'user' | 'admin' = 'user'
): Promise<{ user: any; password: string }> => {
  // Check if user exists
  const [existingUsers] = await pool.execute<Array<any>>(
    'SELECT id FROM users WHERE email = ?',
    [email.toLowerCase()]
  );

  if (existingUsers.length > 0) {
    throw new AppError('User with this email already exists', 409);
  }

  // Generate random password
  const password = generateRandomPassword();
  const passwordHash = await hashPassword(password);
  const userId = generateId();

  // Insert user
  await pool.execute(
    `INSERT INTO users (id, email, name, password_hash, role, is_active)
     VALUES (?, ?, ?, ?, ?, TRUE)`,
    [userId, email.toLowerCase(), name, passwordHash, role]
  );

  // Get created user
  const [users] = await pool.execute<Array<any>>(
    `SELECT id, email, name, avatar, role, is_active, created_at, updated_at
     FROM users WHERE id = ?`,
    [userId]
  );

  const user = users[0];

  return { user, password };
};

/**
 * Update user details by admin
 */
export const updateUserByAdmin = async (
  id: string,
  updates: { name?: string; email?: string; role?: 'user' | 'admin'; is_active?: boolean }
): Promise<any> => {
  const updateFields: string[] = [];
  const updateValues: any[] = [];

  if (updates.name) {
    updateFields.push('name = ?');
    updateValues.push(updates.name);
  }

  if (updates.email) {
    // Check if email is already taken by another user
    const [existingUsers] = await pool.execute<Array<any>>(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [updates.email.toLowerCase(), id]
    );

    if (existingUsers.length > 0) {
      throw new AppError('Email is already taken', 409);
    }

    updateFields.push('email = ?');
    updateValues.push(updates.email.toLowerCase());
  }

  if (updates.role) {
    updateFields.push('role = ?');
    updateValues.push(updates.role);
  }

  if (updates.is_active !== undefined) {
    updateFields.push('is_active = ?');
    updateValues.push(updates.is_active);
  }

  if (updateFields.length === 0) {
    throw new AppError('No fields to update', 400);
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  updateValues.push(id);

  await pool.execute(
    `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
  );

  // Get updated user
  const [users] = await pool.execute<Array<any>>(
    `SELECT id, email, name, avatar, role, is_active, created_at, updated_at
     FROM users WHERE id = ?`,
    [id]
  );

  if (users.length === 0) {
    throw new AppError('User not found', 404);
  }

  return users[0];
};












