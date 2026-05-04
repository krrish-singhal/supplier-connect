import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import {
  listOpportunitiesController,
  getOpportunityByIdController,
  createOpportunityController,
} from '../controllers/opportunityController';

const router = Router();

router.get('/', listOpportunitiesController);
router.get('/:id', getOpportunityByIdController);
router.post('/', verifyToken, createOpportunityController);

export default router;
