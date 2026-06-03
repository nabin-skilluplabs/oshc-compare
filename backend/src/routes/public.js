import { Router } from "express";
import { applicationRouter } from "./public/application-routes.js";
import { orderRouter } from "./public/order-routes.js";
import { paymentRouter } from "./public/payment-routes.js";
import { quoteRouter } from "./public/quote-routes.js";

export const publicRouter = Router();

publicRouter.use(quoteRouter);
publicRouter.use(applicationRouter);
publicRouter.use(orderRouter);
publicRouter.use(paymentRouter);

export { mapQuote, mapQuoteResult, mapApplication, mapOrder, mapMoney } from "./public/mappers.js";
