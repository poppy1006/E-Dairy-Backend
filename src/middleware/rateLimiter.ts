import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1min in milliseconds
  max: 1000,
  message: { status: 429, error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
