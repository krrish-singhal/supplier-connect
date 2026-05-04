import { Request, Response, NextFunction } from "express";
import { admin } from "../config/firebase";
import { errorResponse } from "../utils/responseHelper";

declare global {
  namespace Express {
    interface Request {
      user?: { uid: string };
    }
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      errorResponse(res, "No token provided", 401);
      return;
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = { uid: decodedToken.uid };
    next();
  } catch {
    errorResponse(res, "Unauthorized", 401);
  }
};
