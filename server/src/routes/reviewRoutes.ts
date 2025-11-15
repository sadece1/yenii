import express from 'express';
import {
  createCampsiteReview,
  createGearReview,
  getCampsiteReviews,
  getGearReviews,
  getAllReviews,
  updateReviewStatus,
  markReviewHelpful,
  reportReview,
} from '../controllers/reviewController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Public routes - Yorumları görüntüleme
router.get('/campsites/:campsite_id', getCampsiteReviews);
router.get('/gear/:gear_id', getGearReviews);

// Authenticated routes - Yorum oluşturma
router.post('/campsites', authenticate, createCampsiteReview);
router.post('/gear', authenticate, createGearReview);
router.post('/:id/helpful', authenticate, markReviewHelpful);
router.post('/:id/report', authenticate, reportReview);

// Admin routes - Yorum yönetimi
router.get('/admin/all', authenticate, requireAdmin, getAllReviews);
router.put('/admin/:id/status', authenticate, requireAdmin, updateReviewStatus);

export default router;





