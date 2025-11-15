import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Kamp alanı yorumu oluşturma
export const createCampsiteReview = async (req: Request, res: Response) => {
  try {
    const { campsite_id, rating, title, comment, pros, cons, visit_date } = req.body;
    const userId = (req as any).user.userId;

    // Validasyon
    if (!campsite_id || !rating || !comment) {
      return res.status(400).json({ message: 'Gerekli alanlar eksik' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Puan 1-5 arasında olmalıdır' });
    }

    const reviewId = uuidv4();

    await pool.query(
      `INSERT INTO campsite_reviews 
       (id, user_id, campsite_id, rating, title, comment, pros, cons, visit_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [reviewId, userId, campsite_id, rating, title, comment, pros, cons, visit_date]
    );

    res.status(201).json({
      message: 'Değerlendirmeniz alındı. Admin onayından sonra yayınlanacak.',
      reviewId,
    });
  } catch (error) {
    console.error('Create campsite review error:', error);
    res.status(500).json({ message: 'Değerlendirme oluşturulurken hata oluştu' });
  }
};

// Ekipman yorumu oluşturma
export const createGearReview = async (req: Request, res: Response) => {
  try {
    const { gear_id, rating, title, comment, pros, cons, would_recommend } = req.body;
    const userId = (req as any).user.userId;

    if (!gear_id || !rating || !comment) {
      return res.status(400).json({ message: 'Gerekli alanlar eksik' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Puan 1-5 arasında olmalıdır' });
    }

    // Ekipmanın var olup olmadığını kontrol et
    const [gearCheck] = await pool.query<RowDataPacket[]>(
      'SELECT id, name FROM gear WHERE id = ?',
      [gear_id]
    );

    if (gearCheck.length === 0) {
      return res.status(404).json({ message: 'Ekipman bulunamadı' });
    }

    // Daha önce yorum yapıp yapmadığını kontrol et
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM gear_reviews WHERE user_id = ? AND gear_id = ?',
      [userId, gear_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Bu ürün için zaten değerlendirme yaptınız' });
    }

    const reviewId = uuidv4();

    await pool.query(
      `INSERT INTO gear_reviews 
       (id, user_id, gear_id, rating, title, comment, pros, cons, would_recommend) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [reviewId, userId, gear_id, rating, title, comment, pros, cons, would_recommend ?? true]
    );

    res.status(201).json({
      message: 'Değerlendirmeniz alındı. Admin onayından sonra yayınlanacak.',
      reviewId,
    });
  } catch (error) {
    console.error('Create gear review error:', error);
    res.status(500).json({ message: 'Değerlendirme oluşturulurken hata oluştu' });
  }
};

// Kamp alanı yorumlarını getir
export const getCampsiteReviews = async (req: Request, res: Response) => {
  try {
    const { campsite_id } = req.params;
    const { approved_only = 'true' } = req.query;

    let query = `
      SELECT 
        cr.*,
        u.name as user_name,
        u.email as user_email
      FROM campsite_reviews cr
      JOIN users u ON cr.user_id = u.id
      WHERE cr.campsite_id = ?
    `;

    if (approved_only === 'true') {
      query += ' AND cr.is_approved = TRUE';
    }

    query += ' ORDER BY cr.created_at DESC';

    const [reviews] = await pool.query<RowDataPacket[]>(query, [campsite_id]);

    // İstatistikleri al
    const [stats] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM campsite_rating_stats WHERE campsite_id = ?',
      [campsite_id]
    );

    res.json({
      reviews,
      stats: stats[0] || null,
    });
  } catch (error) {
    console.error('Get campsite reviews error:', error);
    res.status(500).json({ message: 'Yorumlar getirilirken hata oluştu' });
  }
};

// Ekipman yorumlarını getir
export const getGearReviews = async (req: Request, res: Response) => {
  try {
    const { gear_id } = req.params;
    const { approved_only = 'true' } = req.query;

    let query = `
      SELECT 
        gr.*,
        u.name as user_name,
        u.email as user_email
      FROM gear_reviews gr
      JOIN users u ON gr.user_id = u.id
      WHERE gr.gear_id = ?
    `;

    if (approved_only === 'true') {
      query += ' AND gr.is_approved = TRUE';
    }

    query += ' ORDER BY gr.created_at DESC';

    const [reviews] = await pool.query<RowDataPacket[]>(query, [gear_id]);

    // İstatistikleri al
    const [stats] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM gear_rating_stats WHERE gear_id = ?',
      [gear_id]
    );

    res.json({
      reviews,
      stats: stats[0] || null,
    });
  } catch (error) {
    console.error('Get gear reviews error:', error);
    res.status(500).json({ message: 'Yorumlar getirilirken hata oluştu' });
  }
};

// Admin: Tüm yorumları getir (onay bekleyenler)
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const { type = 'all', status = 'pending' } = req.query;

    let campsiteReviews: any[] = [];
    let gearReviews: any[] = [];

    if (type === 'all' || type === 'campsite') {
      let query = `
        SELECT 
          cr.*,
          u.name as user_name,
          u.email as user_email,
          c.name as campsite_name,
          'campsite' as review_type
        FROM campsite_reviews cr
        JOIN users u ON cr.user_id = u.id
        JOIN campsites c ON cr.campsite_id = c.id
      `;

      if (status === 'pending') {
        query += ' WHERE cr.is_approved = FALSE';
      } else if (status === 'approved') {
        query += ' WHERE cr.is_approved = TRUE';
      }

      query += ' ORDER BY cr.created_at DESC';

      const [rows] = await pool.query<RowDataPacket[]>(query);
      campsiteReviews = rows;
    }

    if (type === 'all' || type === 'gear') {
      let query = `
        SELECT 
          gr.*,
          u.name as user_name,
          u.email as user_email,
          g.name as gear_name,
          'gear' as review_type
        FROM gear_reviews gr
        JOIN users u ON gr.user_id = u.id
        JOIN gear g ON gr.gear_id = g.id
      `;

      if (status === 'pending') {
        query += ' WHERE gr.is_approved = FALSE';
      } else if (status === 'approved') {
        query += ' WHERE gr.is_approved = TRUE';
      }

      query += ' ORDER BY gr.created_at DESC';

      const [rows] = await pool.query<RowDataPacket[]>(query);
      gearReviews = rows;
    }

    const allReviews = [...campsiteReviews, ...gearReviews].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    res.json({ reviews: allReviews });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Yorumlar getirilirken hata oluştu' });
  }
};

// Admin: Yorumu onayla/reddet
export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, is_approved, admin_response } = req.body;

    if (!type || typeof is_approved === 'undefined') {
      return res.status(400).json({ message: 'Gerekli alanlar eksik' });
    }

    const table = type === 'campsite' ? 'campsite_reviews' : 'gear_reviews';

    await pool.query(
      `UPDATE ${table} 
       SET is_approved = ?, admin_response = ?, admin_response_date = NOW() 
       WHERE id = ?`,
      [is_approved, admin_response, id]
    );

    // Onaylandıysa kullanıcıya email gönder
    if (is_approved) {
      const [reviewRows] = await pool.query<RowDataPacket[]>(
        `SELECT 
          r.*,
          u.name as user_name,
          u.email as user_email,
          ${type === 'campsite' ? 'c.name as item_name FROM campsite_reviews r' : 'g.name as item_name FROM gear_reviews r'}
          JOIN users u ON r.user_id = u.id
          ${type === 'campsite' ? 'JOIN campsites c ON r.campsite_id = c.id' : 'JOIN gear g ON r.gear_id = g.id'}
          WHERE r.id = ?`,
        [id]
      );

    }

    res.json({ message: 'Yorum durumu güncellendi' });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({ message: 'Yorum güncellenirken hata oluştu' });
  }
};

// Yorumu faydalı bul
export const markReviewHelpful = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = (req as any).user.userId;

    // Daha önce işaretlemiş mi kontrol et
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM review_helpful_votes WHERE user_id = ? AND review_id = ? AND review_type = ?',
      [userId, id, type]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Bu yorumu zaten faydalı bulmuşsunuz' });
    }

    // Vote ekle
    const voteId = uuidv4();
    await pool.query(
      'INSERT INTO review_helpful_votes (id, review_id, review_type, user_id) VALUES (?, ?, ?, ?)',
      [voteId, id, type, userId]
    );

    // Sayacı artır
    const table = type === 'campsite' ? 'campsite_reviews' : 'gear_reviews';
    await pool.query(
      `UPDATE ${table} SET helpful_count = helpful_count + 1 WHERE id = ?`,
      [id]
    );

    res.json({ message: 'Teşekkürler! Geri bildiriminiz kaydedildi' });
  } catch (error) {
    console.error('Mark review helpful error:', error);
    res.status(500).json({ message: 'İşlem sırasında hata oluştu' });
  }
};

// Yorum şikayet et
export const reportReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, reason, description } = req.body;
    const userId = (req as any).user.userId;

    if (!reason) {
      return res.status(400).json({ message: 'Şikayet nedeni gerekli' });
    }

    const reportId = uuidv4();

    await pool.query(
      'INSERT INTO review_reports (id, review_id, review_type, reporter_user_id, reason, description) VALUES (?, ?, ?, ?, ?, ?)',
      [reportId, id, type, userId, reason, description]
    );

    res.json({ message: 'Şikayetiniz alındı. İncelenecektir.' });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({ message: 'Şikayet gönderilirken hata oluştu' });
  }
};

// Alias exports for routes compatibility
export const getSingleReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type = 'all' } = req.query;
  
  try {
    if (type === 'campsite' || type === 'all') {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM campsite_reviews WHERE id = ?',
        [id]
      );
      if (rows.length > 0) {
        return res.json(rows[0]);
      }
    }
    
    if (type === 'gear' || type === 'all') {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM gear_reviews WHERE id = ?',
        [id]
      );
      if (rows.length > 0) {
        return res.json(rows[0]);
      }
    }
    
    res.status(404).json({ message: 'Review not found' });
  } catch (error) {
    console.error('Get single review error:', error);
    res.status(500).json({ message: 'Review getirilirken hata oluştu' });
  }
};

export const create = async (req: Request, res: Response) => {
  const { type } = req.body;
  if (type === 'campsite') {
    return createCampsiteReview(req, res);
  } else if (type === 'gear') {
    return createGearReview(req, res);
  }
  res.status(400).json({ message: 'Invalid review type' });
};

export const update = async (req: Request, res: Response) => {
  // Update functionality - placeholder
  res.status(501).json({ message: 'Update not implemented yet' });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type } = req.query;
  
  try {
    const table = type === 'campsite' ? 'campsite_reviews' : 'gear_reviews';
    await pool.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Review silinirken hata oluştu' });
  }
};
