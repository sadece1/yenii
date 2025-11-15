import pool from '../config/database';
import { Category } from '../types';
import { generateId, generateSlug, isEmpty } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';

/**
 * Get all categories (with hierarchical structure)
 */
export const getCategories = async (): Promise<Category[]> => {
  const [categories] = await pool.execute<Array<any>>(
    'SELECT * FROM categories ORDER BY `order` ASC, name ASC'
  );
  return categories;
};

/**
 * Get category tree (hierarchical structure)
 */
export const getCategoryTree = async (): Promise<any[]> => {
  const categories = await getCategories();
  const categoryMap = new Map<string, any>();
  const rootCategories: any[] = [];

  // Create map
  categories.forEach((cat: any) => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Build tree
  categories.forEach((cat: any) => {
    const category = categoryMap.get(cat.id)!;
    if (cat.parent_id && categoryMap.has(cat.parent_id)) {
      categoryMap.get(cat.parent_id)!.children.push(category);
    } else {
      rootCategories.push(category);
    }
  });

  return rootCategories;
};

/**
 * Get single category by ID
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const [categories] = await pool.execute<Array<any>>(
    'SELECT * FROM categories WHERE id = ?',
    [id]
  );

  if (isEmpty(categories)) {
    return null;
  }

  return categories[0];
};

/**
 * Get category by slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const [categories] = await pool.execute<Array<any>>(
    'SELECT * FROM categories WHERE slug = ?',
    [slug]
  );

  if (isEmpty(categories)) {
    return null;
  }

  return categories[0];
};

/**
 * Create new category
 */
export const createCategory = async (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
  const id = generateId();
  const slug = data.slug || generateSlug(data.name);

  // Check if slug exists
  const existing = await getCategoryBySlug(slug);
  if (existing) {
    throw new AppError('Category with this slug already exists', 409);
  }

  await pool.execute(
    `INSERT INTO categories (id, name, slug, description, parent_id, icon, \`order\`)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      slug,
      data.description || null,
      data.parent_id || null,
      data.icon || null,
      data.order ?? 0,
    ]
  );

  const category = await getCategoryById(id);
  if (!category) {
    throw new AppError('Failed to create category', 500);
  }

  logger.info(`Category created: ${id}`);
  return category;
};

/**
 * Update category
 */
export const updateCategory = async (id: string, data: Partial<Category>): Promise<Category> => {
  const existing = await getCategoryById(id);
  if (!existing) {
    throw new AppError('Category not found', 404);
  }

  const updateFields: string[] = [];
  const updateValues: any[] = [];

  if (data.name) {
    updateFields.push('name = ?');
    updateValues.push(data.name);
  }

  if (data.slug) {
    // Check if slug exists for another category
    const existingBySlug = await getCategoryBySlug(data.slug);
    if (existingBySlug && existingBySlug.id !== id) {
      throw new AppError('Category with this slug already exists', 409);
    }
    updateFields.push('slug = ?');
    updateValues.push(data.slug);
  }

  if (data.description !== undefined) {
    updateFields.push('description = ?');
    updateValues.push(data.description);
  }

  if (data.parent_id !== undefined) {
    // Prevent circular reference
    if (data.parent_id === id) {
      throw new AppError('Category cannot be its own parent', 400);
    }
    updateFields.push('parent_id = ?');
    updateValues.push(data.parent_id);
  }

  if (data.icon !== undefined) {
    updateFields.push('icon = ?');
    updateValues.push(data.icon);
  }

  if (data.order !== undefined) {
    updateFields.push('`order` = ?');
    updateValues.push(data.order);
  }

  if (updateFields.length === 0) {
    return existing;
  }

  updateFields.push('updated_at = CURRENT_TIMESTAMP');
  updateValues.push(id);

  await pool.execute(
    `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
  );

  const updated = await getCategoryById(id);
  if (!updated) {
    throw new AppError('Failed to update category', 500);
  }

  logger.info(`Category updated: ${id}`);
  return updated;
};

/**
 * Delete category
 */
export const deleteCategory = async (id: string): Promise<void> => {
  const category = await getCategoryById(id);
  if (!category) {
    throw new AppError('Category not found', 404);
  }

  await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
  logger.info(`Category deleted: ${id}`);
};












