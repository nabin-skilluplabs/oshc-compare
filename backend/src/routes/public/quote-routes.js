import { Router } from "express";
import { asyncHandler } from "../../lib/async-handler.js";
import { validate } from "../../lib/validation.js";
import { createQuote, getQuoteOrThrow } from "../../services/quote-service.js";
import { getOrCreateQuoteResults } from "../../services/pricing-service.js";
import { mapQuote, mapQuoteResult } from "./mappers.js";
import { quoteSchema } from "./schemas.js";

export const quoteRouter = Router();

quoteRouter.post(
  "/quotes",
  asyncHandler(async (req, res) => {
    const input = validate(quoteSchema, req.body);
    const quote = await createQuote(input);
    res.status(201).json({ data: mapQuote(quote) });
  }),
);

quoteRouter.get(
  "/quotes/:quoteId",
  asyncHandler(async (req, res) => {
    const quote = await getQuoteOrThrow(req.params.quoteId);
    res.json({ data: mapQuote(quote) });
  }),
);

quoteRouter.get(
  "/quotes/:quoteId/results",
  asyncHandler(async (req, res) => {
    const { quote, results } = await getOrCreateQuoteResults(req.params.quoteId);
    const mapped = results.map(mapQuoteResult);
    if (req.query.sort === "provider_name_asc") {
      mapped.sort((a, b) => a.provider.name.localeCompare(b.provider.name));
    } else {
      mapped.sort((a, b) => a.total.amountMinorUnits - b.total.amountMinorUnits);
    }
    res.json({ quote: mapQuote(quote), data: mapped });
  }),
);
