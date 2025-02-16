import { InternalServerError } from "groq-sdk";
import ErrorLogs from "../../model/schemas/errorLogs.js";
import HRCustomError from "../../services/innerServices/errors/HRCustomError.js";
import { pushErrorMsg } from "../../services/innerServices/loggerHandler.js";

/* eslint no-unused-vars: ["error", { "args": "none" }] */
// this is because the error handling middleware requires 4 arguments
export default async function errorHandler(err, req, res, _next) {
  const error = err instanceof HRCustomError ? err : new InternalServerError(err);

  // Log to database and send email if critical
  try {
    await ErrorLogs.create({
      type: error.constructor.name,
      message: error.message,
      stack: error.stack,
      statusCode: error.status,
      path: req.path,
      method: req.method,
      userId: req.user?._id,
      service: req.path.split("/")[1] || "other",
      metadata: { query: req.query, body: req.body }
    });
  } catch (logError) {
    console.error("Error logging failed:", logError);
  }

  if (!res.headersSent) {
    res.status(error.status).json(error.convertToResponse());
  }

  if (req.loggerData) {
    req.loggerData.error = error.getLoggerObject();
  }

  pushErrorMsg(error, req.loggerData?._id);
}
