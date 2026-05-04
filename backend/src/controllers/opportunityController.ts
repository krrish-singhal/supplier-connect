import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { db } from "../config/firebase";
import { successResponse, errorResponse } from "../utils/responseHelper";

export const listOpportunitiesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { category, city, limit, offset } = req.query;
    let query: FirebaseFirestore.Query = db
      .collection("opportunities")
      .orderBy("created_at", "desc");

    if (category) query = query.where("category", "==", category);
    if (city) query = query.where("city", "==", city);

    const snapshot = await query.get();
    let opportunities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const total = opportunities.length;
    const lim = limit ? parseInt(limit as string) : 20;
    const off = offset ? parseInt(offset as string) : 0;
    opportunities = opportunities.slice(off, off + lim);

    successResponse(res, { opportunities, total });
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to fetch opportunities", 500);
  }
};

export const getOpportunityByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const doc = await db.collection("opportunities").doc(id).get();
    if (!doc.exists) {
      errorResponse(res, "Opportunity not found", 404);
      return;
    }
    successResponse(res, { opportunity: { id: doc.id, ...doc.data() } });
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to fetch opportunity", 500);
  }
};

export const createOpportunityController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, city, category, description, cta_label } = req.body;
    if (!title || !city || !category || !description || !cta_label) {
      errorResponse(
        res,
        "title, city, category, description, and cta_label are required",
      );
      return;
    }
    const id = uuid();
    const now = new Date().toISOString();
    const opportunity = {
      id,
      title,
      city,
      category,
      description,
      cta_label,
      created_at: now,
    };
    await db.collection("opportunities").doc(id).set(opportunity);
    successResponse(res, { opportunity }, 201);
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to create opportunity", 500);
  }
};
