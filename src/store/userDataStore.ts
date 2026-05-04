/**
 * userDataStore.ts
 * Manages user-specific data: saved suppliers, sent inquiries, opportunity applications.
 * Persisted via AsyncStorage so data survives app restarts.
 */
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Supplier, Opportunity } from "@/src/types";

export interface Inquiry {
  id: string;
  supplierId: string;
  supplierName: string;
  businessName: string;
  message: string;
  quantity: string;
  contactName: string;
  contactPhone: string;
  status: "pending" | "replied" | "closed";
  createdAt: string; // ISO string for serialisation
}

export interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  message: string;
  status: "submitted" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
}

interface UserDataStore {
  savedSupplierIds: string[];
  inquiries: Inquiry[];
  applications: Application[];

  // Saved Suppliers
  saveSupplier: (supplier: Supplier) => void;
  unsaveSupplier: (supplierId: string) => void;
  isSaved: (supplierId: string) => boolean;

  // Inquiries
  sendInquiry: (inquiry: Omit<Inquiry, "id" | "status" | "createdAt">) => void;

  // Opportunity Applications
  applyToOpportunity: (
    application: Omit<Application, "id" | "status" | "createdAt">,
  ) => void;
  hasApplied: (opportunityId: string) => boolean;

  // Persist & Hydrate
  hydrate: () => Promise<void>;
  _persist: () => Promise<void>;
}

const STORAGE_KEY = "supplierconnect_userdata";

export const useUserDataStore = create<UserDataStore>((set, get) => ({
  savedSupplierIds: [],
  inquiries: [],
  applications: [],

  saveSupplier: (supplier) => {
    const { savedSupplierIds } = get();
    if (savedSupplierIds.includes(supplier.id)) return;
    set({ savedSupplierIds: [...savedSupplierIds, supplier.id] });
    get()._persist();
  },

  unsaveSupplier: (supplierId) => {
    set((s) => ({
      savedSupplierIds: s.savedSupplierIds.filter((id) => id !== supplierId),
    }));
    get()._persist();
  },

  isSaved: (supplierId) => get().savedSupplierIds.includes(supplierId),

  sendInquiry: (inquiry) => {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: `inq_${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ inquiries: [newInquiry, ...s.inquiries] }));
    get()._persist();
  },

  applyToOpportunity: (application) => {
    const newApp: Application = {
      ...application,
      id: `app_${Date.now()}`,
      status: "submitted",
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ applications: [newApp, ...s.applications] }));
    get()._persist();
  },

  hasApplied: (opportunityId) =>
    get().applications.some((a) => a.opportunityId === opportunityId),

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set({
          savedSupplierIds: data.savedSupplierIds ?? [],
          inquiries: data.inquiries ?? [],
          applications: data.applications ?? [],
        });
      }
    } catch (e) {
      console.error("[userDataStore] hydrate error:", e);
    }
  },

  _persist: async () => {
    try {
      const { savedSupplierIds, inquiries, applications } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ savedSupplierIds, inquiries, applications }),
      );
    } catch (e) {
      console.error("[userDataStore] persist error:", e);
    }
  },
}));
