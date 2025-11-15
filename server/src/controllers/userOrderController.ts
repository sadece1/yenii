import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import logger from '../utils/logger';

interface UserOrder {
  id: string;
  userId: string;
  gearId: string;
  status: 'waiting' | 'arrived' | 'shipped';
  price: number;
  publicNote?: string;
  privateNote?: string;
  shippedDate?: string;
  shippedTime?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserOrderRow extends RowDataPacket {
  id: string;
  user_id: string;
  gear_id: string;
  status: 'waiting' | 'arrived' | 'shipped';
  price: number;
  public_note: string | null;
  private_note: string | null;
  shipped_date: string | null;
  shipped_time: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new user order
 */
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userId,
      gearId,
      status = 'waiting',
      price,
      publicNote,
      privateNote,
      shippedDate,
      shippedTime,
    } = req.body;

    // Validation
    if (!userId || !gearId || price === undefined || price === null) {
      res.status(400).json({
        success: false,
        error: 'userId, gearId ve price zorunludur',
      });
      return;
    }

    // Validate status
    const validStatuses = ['waiting', 'arrived', 'shipped'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Geçersiz durum. Geçerli değerler: waiting, arrived, shipped',
      });
      return;
    }

    // If status is shipped, shippedDate and shippedTime are required
    if (status === 'shipped' && (!shippedDate || !shippedTime)) {
      res.status(400).json({
        success: false,
        error: 'Shipped durumu için shippedDate ve shippedTime gereklidir',
      });
      return;
    }

    const orderId = uuidv4();

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO user_orders 
      (id, user_id, gear_id, status, price, public_note, private_note, shipped_date, shipped_time) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        userId,
        gearId,
        status,
        price,
        publicNote || null,
        privateNote || null,
        shippedDate || null,
        shippedTime || null,
      ]
    );

    if (result.affectedRows === 0) {
      res.status(500).json({
        success: false,
        error: 'Sipariş oluşturulamadı',
      });
      return;
    }

    // Fetch the created order
    const [orders] = await pool.execute<UserOrderRow[]>(
      'SELECT * FROM user_orders WHERE id = ?',
      [orderId]
    );

    const order = orders[0];
    
    const responseOrder: UserOrder = {
      id: order.id,
      userId: order.user_id,
      gearId: order.gear_id,
      status: order.status,
      price: order.price,
      publicNote: order.public_note || undefined,
      privateNote: order.private_note || undefined,
      shippedDate: order.shipped_date || undefined,
      shippedTime: order.shipped_time || undefined,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };

    logger.info(`User order created: ${orderId} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: responseOrder,
      message: 'Sipariş başarıyla oluşturuldu',
    });
  } catch (error: any) {
    logger.error('Create order error:', error);
    next(error);
  }
};

/**
 * Get all orders (admin) or user's orders
 */
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, status } = req.query;
    const isAdmin = req.user?.role === 'admin';

    let query = 'SELECT * FROM user_orders';
    const params: any[] = [];
    const conditions: string[] = [];

    // If not admin, only show user's own orders
    if (!isAdmin && req.user?.id) {
      conditions.push('user_id = ?');
      params.push(req.user.id);
    } else if (userId) {
      // Admin can filter by userId
      conditions.push('user_id = ?');
      params.push(userId);
    }

    // Status filter
    if (status && ['waiting', 'arrived', 'shipped'].includes(status as string)) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [orders] = await pool.execute<UserOrderRow[]>(query, params);

    const responseOrders: UserOrder[] = orders.map((order) => ({
      id: order.id,
      userId: order.user_id,
      gearId: order.gear_id,
      status: order.status,
      price: order.price,
      publicNote: order.public_note || undefined,
      privateNote: isAdmin ? order.private_note || undefined : undefined, // Only admin can see private notes
      shippedDate: order.shipped_date || undefined,
      shippedTime: order.shipped_time || undefined,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }));

    res.status(200).json({
      success: true,
      data: responseOrders,
    });
  } catch (error: any) {
    logger.error('Get orders error:', error);
    next(error);
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const isAdmin = req.user?.role === 'admin';

    const [orders] = await pool.execute<UserOrderRow[]>(
      'SELECT * FROM user_orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Sipariş bulunamadı',
      });
      return;
    }

    const order = orders[0];

    // Check if user owns this order (unless admin)
    if (!isAdmin && order.user_id !== req.user?.id) {
      res.status(403).json({
        success: false,
        error: 'Bu siparişi görüntüleme yetkiniz yok',
      });
      return;
    }

    const responseOrder: UserOrder = {
      id: order.id,
      userId: order.user_id,
      gearId: order.gear_id,
      status: order.status,
      price: order.price,
      publicNote: order.public_note || undefined,
      privateNote: isAdmin ? order.private_note || undefined : undefined,
      shippedDate: order.shipped_date || undefined,
      shippedTime: order.shipped_time || undefined,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    };

    res.status(200).json({
      success: true,
      data: responseOrder,
    });
  } catch (error: any) {
    logger.error('Get order by ID error:', error);
    next(error);
  }
};

/**
 * Update order (admin only)
 */
export const updateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      userId,
      gearId,
      status,
      price,
      publicNote,
      privateNote,
      shippedDate,
      shippedTime,
    } = req.body;

    // Only admin can update orders
    if (req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Siparişleri güncelleme yetkiniz yok',
      });
      return;
    }

    // Check if order exists
    const [orders] = await pool.execute<UserOrderRow[]>(
      'SELECT * FROM user_orders WHERE id = ?',
      [id]
    );

    if (orders.length === 0) {
      res.status(404).json({
        success: false,
        error: 'Sipariş bulunamadı',
      });
      return;
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['waiting', 'arrived', 'shipped'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          error: 'Geçersiz durum',
        });
        return;
      }
    }

    // Build update query dynamically
    const updates: string[] = [];
    const params: any[] = [];

    if (userId !== undefined) {
      updates.push('user_id = ?');
      params.push(userId);
    }
    if (gearId !== undefined) {
      updates.push('gear_id = ?');
      params.push(gearId);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      params.push(price);
    }
    if (publicNote !== undefined) {
      updates.push('public_note = ?');
      params.push(publicNote || null);
    }
    if (privateNote !== undefined) {
      updates.push('private_note = ?');
      params.push(privateNote || null);
    }
    if (shippedDate !== undefined) {
      updates.push('shipped_date = ?');
      params.push(shippedDate || null);
    }
    if (shippedTime !== undefined) {
      updates.push('shipped_time = ?');
      params.push(shippedTime || null);
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Güncellenecek alan bulunamadı',
      });
      return;
    }

    params.push(id);

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE user_orders SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      res.status(500).json({
        success: false,
        error: 'Sipariş güncellenemedi',
      });
      return;
    }

    // Fetch updated order
    const [updatedOrders] = await pool.execute<UserOrderRow[]>(
      'SELECT * FROM user_orders WHERE id = ?',
      [id]
    );

    const updatedOrder = updatedOrders[0];

    const responseOrder: UserOrder = {
      id: updatedOrder.id,
      userId: updatedOrder.user_id,
      gearId: updatedOrder.gear_id,
      status: updatedOrder.status,
      price: updatedOrder.price,
      publicNote: updatedOrder.public_note || undefined,
      privateNote: updatedOrder.private_note || undefined,
      shippedDate: updatedOrder.shipped_date || undefined,
      shippedTime: updatedOrder.shipped_time || undefined,
      createdAt: updatedOrder.created_at,
      updatedAt: updatedOrder.updated_at,
    };

    logger.info(`User order updated: ${id}`);

    res.status(200).json({
      success: true,
      data: responseOrder,
      message: 'Sipariş başarıyla güncellendi',
    });
  } catch (error: any) {
    logger.error('Update order error:', error);
    next(error);
  }
};

/**
 * Delete order (admin only)
 */
export const deleteOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Only admin can delete orders
    if (req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Siparişleri silme yetkiniz yok',
      });
      return;
    }

    const [result] = await pool.execute<ResultSetHeader>(
      'DELETE FROM user_orders WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        error: 'Sipariş bulunamadı',
      });
      return;
    }

    logger.info(`User order deleted: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Sipariş başarıyla silindi',
    });
  } catch (error: any) {
    logger.error('Delete order error:', error);
    next(error);
  }
};

