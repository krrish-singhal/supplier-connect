import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import {
  listSuppliersController,
  listCategoriesController,
  listByRegionController,
  getSupplierByIdController,
  createSupplierController,
  updateSupplierController,
} from '../controllers/supplierController';

const router = Router();

router.get('/categories/list', listCategoriesController);
router.get('/region/:region', listByRegionController);
router.get('/', listSuppliersController);
router.get('/:id', getSupplierByIdController);
router.post('/', verifyToken, createSupplierController);
router.put('/:id', verifyToken, updateSupplierController);

export default router;
