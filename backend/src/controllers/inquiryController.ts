import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { db } from "../config/firebase";
import { sendPushNotification } from "../services/fcmService";
import { successResponse, errorResponse } from "../utils/responseHelper";

export const sendInquiryController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { supplier_id, message } = req.body;
    if (!supplier_id || !message) {
      errorResponse(res, "supplier_id and message are required");
      return;
    }

    const id = uuid();
    const now = new Date().toISOString();
    const inquiry = {
      id,
      user_id: req.user!.uid,
      supplier_id,
      message,
      created_at: now,
    };
    await db.collection("inquiries").doc(id).set(inquiry);

    // Fire-and-forget FCM notification to supplier owner
    try {
      const supplierDoc = await db
        .collection("suppliers")
        .doc(supplier_id)
        .get();
      if (supplierDoc.exists) {
        const supplierData = supplierDoc.data()!;
        const ownerDoc = await db
          .collection("users")
          .doc(supplierData.user_id)
          .get();
        if (ownerDoc.exists) {
          const ownerData = ownerDoc.data()!;
          if (ownerData.fcm_token) {
            await sendPushNotification({
              token: ownerData.fcm_token,
              title: "New Inquiry Received",
              body: message.substring(0, 100),
            });
          }
        }
      }
    } catch (fcmErr) {
      console.error("FCM notification failed (non-fatal):", fcmErr);
    }

    successResponse(res, { inquiry }, 201);
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to send inquiry", 500);
  }
};

export const getMyInquiriesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const snapshot = await db
      .collection("inquiries")
      .where("user_id", "==", req.user!.uid)
      .orderBy("created_at", "desc")
      .get();
    const inquiries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    successResponse(res, { inquiries });
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to fetch inquiries", 500);
  }
};

export const getReceivedInquiriesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const supplierSnap = await db
      .collection("suppliers")
      .where("user_id", "==", req.user!.uid)
      .limit(1)
      .get();

    if (supplierSnap.empty) {
      successResponse(res, { inquiries: [] });
      return;
    }

    const supplierId = supplierSnap.docs[0].id;
    const snapshot = await db
      .collection("inquiries")
      .where("supplier_id", "==", supplierId)
      .orderBy("created_at", "desc")
      .get();
    const inquiries = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    successResponse(res, { inquiries });
  } catch (err: any) {
    errorResponse(
      res,
      err.message || "Failed to fetch received inquiries",
      500,
    );
  }
};
