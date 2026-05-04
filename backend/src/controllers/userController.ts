import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { admin, db } from "../config/firebase";
import { deriveRegion } from "../services/supplierService";
import { successResponse, errorResponse } from "../utils/responseHelper";

export const onboardingController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, company_name, type, city, categories } = req.body;
    if (!name || !company_name || !type || !city) {
      errorResponse(res, "name, company_name, type, and city are required");
      return;
    }

    // Get mobile from Firebase Auth user record
    const firebaseUser = await admin.auth().getUser(req.user!.uid);
    const mobile = firebaseUser.phoneNumber || "";

    const now = new Date().toISOString();
    const userId = req.user!.uid;

    const user = {
      id: userId,
      name,
      mobile,
      company_name,
      type,
      city,
      categories: categories || [],
      is_verified: false,
      fcm_token: null,
      created_at: now,
    };

    await db.collection("users").doc(userId).set(user);

    // If supplier type, create supplier document too
    if (type === "supplier") {
      const supplierId = uuid();
      const supplier = {
        id: supplierId,
        user_id: userId,
        name: company_name,
        city,
        state: "",
        region: deriveRegion(city),
        category: (categories && categories[0]) || "",
        description: "",
        is_verified: false,
        logo_url: null,
        created_at: now,
      };
      await db.collection("suppliers").doc(supplierId).set(supplier);
    }

    successResponse(res, { user }, 201);
  } catch (err: any) {
    errorResponse(res, err.message || "Onboarding failed", 500);
  }
};

export const getMeController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const doc = await db.collection("users").doc(req.user!.uid).get();
    if (!doc.exists) {
      errorResponse(res, "User not found", 404);
      return;
    }
    successResponse(res, { user: { id: doc.id, ...doc.data() } });
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to fetch user", 500);
  }
};

export const updateMeController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, city, company_name } = req.body;
    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (city !== undefined) updates.city = city;
    if (company_name !== undefined) updates.company_name = company_name;

    await db.collection("users").doc(req.user!.uid).update(updates);
    const doc = await db.collection("users").doc(req.user!.uid).get();
    successResponse(res, { user: { id: doc.id, ...doc.data() } });
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to update user", 500);
  }
};

export const updateFcmTokenController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { fcm_token } = req.body;
    if (!fcm_token) {
      errorResponse(res, "fcm_token is required");
      return;
    }
    await db.collection("users").doc(req.user!.uid).update({ fcm_token });
    successResponse(res, {});
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to update FCM token", 500);
  }
};
