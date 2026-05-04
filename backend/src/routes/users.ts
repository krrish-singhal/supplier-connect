import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import {
  onboardingController,
  getMeController,
  updateMeController,
  updateFcmTokenController,
} from '../controllers/userController';

const router = Router();

router.post('/onboarding', verifyToken, onboardingController);
router.get('/me', verifyToken, getMeController);
router.put('/me', verifyToken, updateMeController);
router.put('/fcm-token', verifyToken, updateFcmTokenController);

export default router;
