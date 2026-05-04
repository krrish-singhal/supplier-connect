import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { db } from "../config/firebase";
import { getSuppliers, getRegionCities } from "../services/supplierService";
import { successResponse, errorResponse } from "../utils/responseHelper";

export const listSuppliersController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { region, category, city, is_verified, search, limit, offset } =
      req.query;
    const result = await getSuppliers({
      region: region as string,
      category: category as string,
      city: city as string,
      is_verified: is_verified as string,
      search: search as string,
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    });
    successResponse(res, result);
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to fetch suppliers", 500);
  }
};

export const listCategoriesController = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  const categories = [
    "Industrial",
    "Construction",
    "Packaging",
    "Electronics",
    "Furniture",
    "Machinery",
    "Chemicals",
    "Office Supplies",
    "Food & Beverage Supply",
    "Logistics",
    "Textile",
    "Services",
  ];
  successResponse(res, { categories });
};

export const listByRegionController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { region } = req.params;
    const snapshot = await db
      .collection("suppliers")
      .where("region", "==", region)
      .get();
    const suppliers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const cities = getRegionCities(region);
    successResponse(res, { region, cities, suppliers });
  } catch (err: any) {
    errorResponse(
      res,
      err.message || "Failed to fetch suppliers by region",
      500,
    );
  }
};

export const getSupplierByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const doc = await db.collection("suppliers").doc(id).get();
    if (!doc.exists) {
      errorResponse(res, "Supplier not found", 404);
      return;
    }
    const productsSnap = await db
      .collection("products")
      .where("supplier_id", "==", id)
      .get();
    const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    successResponse(res, { supplier: { id: doc.id, ...doc.data() }, products });
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to fetch supplier", 500);
  }
};

export const createSupplierController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, city, state, region, category, description } = req.body;
    if (!name || !city || !region || !category) {
      errorResponse(res, "name, city, region, and category are required");
      return;
    }
    const id = uuid();
    const now = new Date().toISOString();
    const supplier = {
      id,
      user_id: req.user!.uid,
      name,
      city,
      state: state || "",
      region,
      category,
      description: description || "",
      is_verified: false,
      logo_url: null,
      created_at: now,
    };
    await db.collection("suppliers").doc(id).set(supplier);
    successResponse(res, { supplier }, 201);
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to create supplier", 500);
  }
};

export const updateSupplierController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const doc = await db.collection("suppliers").doc(id).get();
    if (!doc.exists) {
      errorResponse(res, "Supplier not found", 404);
      return;
    }
    const data = doc.data()!;
    if (data.user_id !== req.user!.uid) {
      errorResponse(res, "Forbidden", 403);
      return;
    }
    const { name, city, state, region, category, description } = req.body;
    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (city !== undefined) updates.city = city;
    if (state !== undefined) updates.state = state;
    if (region !== undefined) updates.region = region;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    await db.collection("suppliers").doc(id).update(updates);
    const updated = await db.collection("suppliers").doc(id).get();
    successResponse(res, { supplier: { id: updated.id, ...updated.data() } });
  } catch (err: any) {
    errorResponse(res, err.message || "Failed to update supplier", 500);
  }
};
