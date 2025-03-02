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
import authRouter from "./api/routes/unprotected/authRoutes.js";
import systemRoute from "./api/routes/unprotected/healthCheckRoute.js";
import mainRouter from "./api/routes/unprotected/mainRoutes.js";
import { verifyToken } from "./api/middlewares/appMiddlewares/authentication.js";

const PORT = process.env.SERVER_PORT ?? 9718;
const isTestEnv = process.env.NODE_ENV === "test";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  fingerprint({
    parameters: [fingerprint.useragent, fingerprint.acceptHeaders, fingerprint.geoip]
  })
);

app.use(earlyOnsetErrorHandler);

app.use(requestLogger);

app.use(
  rateLimit({
    windowMs: config.limitWindowMs, //  window
    max: config.maxReqAmount, // limit each IP to x requests per windowMs
    keyGenerator: (req) => req.loggerData.ip,
    handler: rateLimitHandler
  })
);

/* UNPROTECTED ROUTES */
app.use("/system", systemRoute);
app.use("/auth", authRouter);
app.use("", mainRouter);

// app.use(verifyToken);

/* PROTECTED ROUTES */
// app.use("/your-protected-routes-below", employeeRoutes);

app.use(routeNotFound);

/* ERROR HANDLER */
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
