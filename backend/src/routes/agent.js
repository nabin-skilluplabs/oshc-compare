import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { agentAuthRouter } from "./agent/auth-routes.js";
import { agentQuoteRouter } from "./agent/quote-routes.js";

export const agentRouter = Router();

agentRouter.use(agentAuthRouter);
agentRouter.use(requireAuth("agent"));
agentRouter.use(agentQuoteRouter);
