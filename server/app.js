// Load environment variables before any other imports
import "./api/services/innerServices/loadEnvService.js";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fingerprint from "express-fingerprint";
import config from "./api/config.js";
import earlyOnsetErrorHandler from "./api/middlewares/appMiddlewares/earlyOnsetErrorHandler.js";
import rateLimitHandler from "./api/middlewares/appMiddlewares/rateLimitHandler.js";
import { cLog } from "./api/services/innerServices/loggerHandler.js";
import errorHandler from "./api/middlewares/appMiddlewares/errorHandler.js";
import { connectToMongoDB } from "./api/model/connectionHandler.js";
import requestLogger from "./api/middlewares/appMiddlewares/requestLogger.js";
import routeNotFound from "./api/middlewares/appMiddlewares/routeNotFound.js";
import systemRoute from "./api/routes/unprotected/healthCheckRoute.js";
import surveyRouter from "./api/routes/unprotected/surveyRoutes.js";
import imageRouter from "./api/routes/unprotected/imageRoutes.js";
import emailRouter from "./api/routes/unprotected/emailRoutes.js";

const PORT = process.env.SERVER_PORT ?? 9718;
const isTestEnv = process.env.NODE_ENV === "test";

const app = express();

// --- Global middleware chain ---
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Browser fingerprinting for request tracking and rate-limit key generation
app.use(
  fingerprint({
    parameters: [fingerprint.useragent, fingerprint.acceptHeaders, fingerprint.geoip]
  })
);

// Catches malformed JSON and oversized payloads before they reach route handlers
app.use(earlyOnsetErrorHandler);

// Logs every request (method, path, IP, browser, duration) to MongoDB
app.use(requestLogger);

// IP-based rate limiting to prevent abuse
app.use(
  rateLimit({
    windowMs: config.limitWindowMs,
    max: config.maxReqAmount,
    keyGenerator: (req) => req.loggerData.ip,
    handler: rateLimitHandler
  })
);

// --- API Routes ---
app.use("/system", systemRoute);
app.use("/api", surveyRouter);
app.use("/image", imageRouter);
app.use("/email", emailRouter);

// Fallback: returns 404 for any unmatched route
app.use(routeNotFound);

// Centralized error handler — logs to DB and returns structured JSON response
app.use(errorHandler);

const startServer = async () => {
  try {
    if (isTestEnv) return;

    await connectToMongoDB();
    await new Promise((resolve, reject) => {
      const server = app.listen(PORT, resolve);
      server.on("error", reject);
    });

    cLog(`Server is running on port ${PORT}`);
  } catch (err) {
    cLog("Error while starting server");
    cLog(err);
  }
};

startServer();

export default app;
