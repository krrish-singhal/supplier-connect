import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { db } from "../config/firebase";
import { successResponse, errorResponse } from "../utils/responseHelper";

export const saveSupplierController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { supplier_id } = req.body;
    if (!supplier_id) {
      errorResponse(res, "supplier_id is required");
      return;
    }

    const existing = await db
      .collection("saved_suppliers")
      .where("user_id", "==", req.user!.uid)
      .where("supplier_id", "==", supplier_id)
      .limit(1)
      .get();

    if (!existing.empty) {
      errorResponse(res, "Supplier already saved", 409);
      return;
    }

    const id = uuid();
    const now = new Date().toISOString();
    const saved = { id, user_id: req.user!.uid, supplier_id, created_at: now };
    await db.collection("saved_suppliers").doc(id).set(saved);
    successResponse(res, { saved }, 201);
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to save supplier", 500);
  }
};

export const unsaveSupplierController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { supplier_id } = req.params;
    const snapshot = await db
      .collection("saved_suppliers")
      .where("user_id", "==", req.user!.uid)
      .where("supplier_id", "==", supplier_id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      errorResponse(res, "Not found", 404);
      return;
    }

    await snapshot.docs[0].ref.delete();
    successResponse(res, { message: "Removed from saved" });
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to remove saved supplier", 500);
  }
};

export const getSavedSuppliersController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const snapshot = await db
      .collection("saved_suppliers")
      .where("user_id", "==", req.user!.uid)
      .get();

    if (snapshot.empty) {
      successResponse(res, { suppliers: [] });
      return;
    }

    const supplierIds = snapshot.docs.map(
      (doc) => doc.data().supplier_id as string,
    );
    const suppliers = await Promise.all(
      supplierIds.map(async (sid) => {
        const doc = await db.collection("suppliers").doc(sid).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
      }),
    );

    successResponse(res, { suppliers: suppliers.filter(Boolean) });
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to fetch saved suppliers", 500);
  }
};
