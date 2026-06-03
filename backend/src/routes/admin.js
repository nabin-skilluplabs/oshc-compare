import { Router } from "express";
import { adminAuthRouter } from "./admin/auth-routes.js";
import { adminCatalogRouter } from "./admin/catalog-routes.js";
import { requireAdmin } from "./admin/helpers.js";
import { adminOrderRouter } from "./admin/order-routes.js";
import { adminPriceImportRouter } from "./admin/price-import-routes.js";
import { adminReportRouter } from "./admin/report-routes.js";

export const adminRouter = Router();

adminRouter.use(adminAuthRouter);
adminRouter.use(requireAdmin);
adminRouter.use(adminCatalogRouter);
adminRouter.use(adminPriceImportRouter);
adminRouter.use(adminOrderRouter);
adminRouter.use(adminReportRouter);

export { audit, mapAdminOrderSummary, mapProduct, mapProvider } from "./admin/helpers.js";
