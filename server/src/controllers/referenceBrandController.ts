import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import pool from '../config/database';
import { deleteFile } from '../utils/fileHelper';
import path from 'path';

// Get all reference brands (public)
export const getAllReferenceBrands = asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query(
    'SELECT * FROM reference_brands WHERE is_active = TRUE ORDER BY display_order ASC, created_at DESC'
  );

  res.status(200).json({
    success: true,
    data: result.rows,
  });
});

// Get single reference brand
export const getReferenceBrand = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    'SELECT * FROM reference_brands WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: 'Reference brand not found',
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: result.rows[0],
  });
});

// Create reference brand (admin only)
export const createReferenceBrand = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, description, website_url, display_order, is_active } = req.body;
  const logo_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !logo_url) {
    res.status(400).json({
      success: false,
      message: 'Name and logo are required',
    });
    return;
  }

  const result = await pool.query(
    `INSERT INTO reference_brands (name, description, logo_url, website_url, display_order, is_active)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, description || null, logo_url, website_url || null, display_order || 0, is_active !== false]
  );

  res.status(201).json({
    success: true,
    message: 'Reference brand created successfully',
    data: result.rows[0],
  });
});

// Update reference brand (admin only)
export const updateReferenceBrand = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, description, website_url, display_order, is_active } = req.body;
  const new_logo_url = req.file ? `/uploads/${req.file.filename}` : null;

  // Get existing brand
  const existingResult = await pool.query(
    'SELECT * FROM reference_brands WHERE id = $1',
    [id]
  );

  if (existingResult.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: 'Reference brand not found',
    });
    return;
  }

  const existingBrand = existingResult.rows[0];
  const old_logo_url = existingBrand.logo_url;

  // Update with new logo or keep existing
  const logo_url = new_logo_url || old_logo_url;

  const result = await pool.query(
    `UPDATE reference_brands 
     SET name = $1, description = $2, logo_url = $3, website_url = $4, 
         display_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING *`,
    [
      name || existingBrand.name,
      description !== undefined ? description : existingBrand.description,
      logo_url,
      website_url !== undefined ? website_url : existingBrand.website_url,
      display_order !== undefined ? display_order : existingBrand.display_order,
      is_active !== undefined ? is_active : existingBrand.is_active,
      id,
    ]
  );

  // Delete old logo file if new one was uploaded
  if (new_logo_url && old_logo_url && old_logo_url !== logo_url) {
    try {
      const oldFilePath = path.join(process.cwd(), old_logo_url);
      await deleteFile(oldFilePath);
    } catch (error) {
      console.error('Failed to delete old logo:', error);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Reference brand updated successfully',
    data: result.rows[0],
  });
});

// Delete reference brand (admin only)
export const deleteReferenceBrand = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Get brand to delete logo file
  const result = await pool.query(
    'SELECT logo_url FROM reference_brands WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: 'Reference brand not found',
    });
    return;
  }

  const logo_url = result.rows[0].logo_url;

  // Delete from database
  await pool.query('DELETE FROM reference_brands WHERE id = $1', [id]);

  // Delete logo file
  if (logo_url) {
    try {
      const filePath = path.join(process.cwd(), logo_url);
      await deleteFile(filePath);
    } catch (error) {
      console.error('Failed to delete logo file:', error);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Reference brand deleted successfully',
  });
});

// Toggle reference brand active status (admin only)
export const toggleReferenceBrandStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    `UPDATE reference_brands 
     SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404).json({
      success: false,
      message: 'Reference brand not found',
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Reference brand status updated successfully',
    data: result.rows[0],
  });
});




