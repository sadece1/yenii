import { Router } from 'express';
import {
  getAllReferenceBrands,
  getReferenceBrand,
  createReferenceBrand,
  updateReferenceBrand,
  deleteReferenceBrand,
  toggleReferenceBrandStatus,
} from '../controllers/referenceBrandController';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getAllReferenceBrands);
router.get('/:id', getReferenceBrand);

// Admin routes
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  upload.single('logo'),
  createReferenceBrand
);

router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  upload.single('logo'),
  updateReferenceBrand
);

router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  deleteReferenceBrand
);

router.patch(
  '/:id/toggle-status',
  authenticate,
  authorizeAdmin,
  toggleReferenceBrandStatus
);

export default router;




