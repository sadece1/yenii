import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from '../controllers/userOrderController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/user-orders
 * @desc    Create a new user order (authenticated users)
 * @access  Private (authenticated users)
 */
router.post('/', authenticate, createOrder);

/**
 * @route   GET /api/user-orders
 * @desc    Get all orders (admin sees all, users see only their own)
 * @access  Private
 */
router.get('/', authenticate, getOrders);

/**
 * @route   GET /api/user-orders/:id
 * @desc    Get order by ID
 * @access  Private (owner or admin)
 */
router.get('/:id', authenticate, getOrderById);

/**
 * @route   PUT /api/user-orders/:id
 * @desc    Update order (admin only)
 * @access  Private (admin only)
 */
router.put('/:id', authenticate, authorizeAdmin, updateOrder);

/**
 * @route   DELETE /api/user-orders/:id
 * @desc    Delete order (admin only)
 * @access  Private (admin only)
 */
router.delete('/:id', authenticate, authorizeAdmin, deleteOrder);

export default router;





