import "dotenv/config";
// Firebase must be initialized before any other imports that use it
import "./config/firebase";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import suppliersRouter from "./routes/suppliers";
import opportunitiesRouter from "./routes/opportunities";
import inquiriesRouter from "./routes/inquiries";
import savedRouter from "./routes/saved";
import { errorResponse } from "./utils/responseHelper";

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", env: NODE_ENV, timestamp: new Date() });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/opportunities", opportunitiesRouter);
app.use("/api/inquiries", inquiriesRouter);
app.use("/api/saved", savedRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  errorResponse(res, "Route not found", 404);
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  errorResponse(res, "Internal server error", 500);
});

app.listen(PORT, () => {
  console.log(
    `SupplierConnect backend running on port ${PORT} in ${NODE_ENV} mode`,
  );
});
