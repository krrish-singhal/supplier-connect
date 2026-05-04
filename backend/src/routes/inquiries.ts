import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import {
  sendInquiryController,
  getMyInquiriesController,
  getReceivedInquiriesController,
} from "../controllers/inquiryController";

const router = Router();

router.use(verifyToken);

router.post("/", sendInquiryController);
router.get("/mine", getMyInquiriesController);
router.get("/received", getReceivedInquiriesController);

export default router;
