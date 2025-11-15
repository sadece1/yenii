import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  createUserByAdmin,
  updateUserByAdmin,
} from '../services/adminService';
import { asyncHandler } from '../middleware/errorHandler';
import { parseDate } from '../utils/helpers';

export const getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stats = await getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});

export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const result = await getAllUsers(req.query);
  res.status(200).json({
    success: true,
    data: result.data.map((u: any) => ({
      ...u,
      created_at: parseDate(u.created_at),
      updated_at: parseDate(u.updated_at),
    })),
    pagination: result.pagination,
  });
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    res.status(400).json({ success: false, message: 'Invalid role' });
    return;
  }

  await updateUserRole(id, role);
  res.status(200).json({ success: true, message: 'User role updated successfully' });
});

export const removeUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  await deleteUser(id);
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

export const createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, role } = req.body;

  if (!name || !email) {
    res.status(400).json({ success: false, message: 'Name and email are required' });
    return;
  }

  if (role && !['user', 'admin'].includes(role)) {
    res.status(400).json({ success: false, message: 'Invalid role' });
    return;
  }

  const result = await createUserByAdmin(name, email, role);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: {
        ...result.user,
        created_at: parseDate(result.user.created_at),
        updated_at: parseDate(result.user.updated_at),
      },
      password: result.password, // Return password so admin can see it
    },
  });
});

export const updateUserDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, email, role, is_active } = req.body;

  if (role && !['user', 'admin'].includes(role)) {
    res.status(400).json({ success: false, message: 'Invalid role' });
    return;
  }

  const user = await updateUserByAdmin(id, { name, email, role, is_active });
  
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: {
      ...user,
      created_at: parseDate(user.created_at),
      updated_at: parseDate(user.updated_at),
    },
  });
});












