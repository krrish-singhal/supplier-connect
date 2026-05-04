import { Request, Response } from "express";
import { admin, db } from "../config/firebase";
import { sendOtp, verifyOtp } from "../services/authService";
import { successResponse, errorResponse } from "../utils/responseHelper";

export const sendOtpController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { mobile } = req.body;
    if (!mobile || typeof mobile !== "string" || !mobile.startsWith("+")) {
      errorResponse(
        res,
        "Invalid mobile number. Must be in E.164 format e.g. +919876543210",
      );
      return;
    }
    if (process.env.NODE_ENV === "development") {
      await sendOtp(mobile);
      successResponse(res, { message: "OTP sent (dev mode — use 123456)" });
    } else {
      // PROD: use Firebase Auth REST trigger
      await sendOtp(mobile);
      successResponse(res, { message: "OTP sent" });
    }
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to send OTP", 500);
  }
};

export const verifyOtpController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      errorResponse(res, "mobile and otp are required");
      return;
    }
    const result = await verifyOtp(mobile, otp);
    successResponse(res, result);
  } catch (err: any) {
    const status = err.message?.includes("not found") ? 404 : 400;
    errorResponse(res, err.message || "Verification failed", status);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await admin.auth().revokeRefreshTokens(req.user!.uid);
    successResponse(res, { message: "Logged out" });
  } catch (err: any) {
    errorResponse(res, err.message || "Logout failed", 500);
  }
};
