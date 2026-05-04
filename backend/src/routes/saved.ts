import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import {
  saveSupplierController,
  unsaveSupplierController,
  getSavedSuppliersController,
} from "../controllers/savedController";

const router = Router();

router.use(verifyToken);

router.post("/", saveSupplierController);
router.delete("/:supplier_id", unsaveSupplierController);
router.get("/", getSavedSuppliersController);

export default router;
