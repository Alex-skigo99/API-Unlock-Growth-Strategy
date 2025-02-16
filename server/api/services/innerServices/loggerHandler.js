import sendEmail from "./emails/emailService.js";
import { ERROR_NOTIFICATION } from "./emails/emailEnums.js";
import HRCustomError from "./errors/HRCustomError.js";
import { InternalServerError } from "./errors/CustomErrors.js";
import config from "../../config.js";

export const cLog = console.log;

export const localLog = (msg) => {
  if (process.env.NODE_ENV === "development") {
    console.log(msg);
  }
};

const makePrettyErrorMessage = (errorData) =>
  Object.entries(errorData).reduce((msg, [key, value]) => {
    if (key === "name") return msg;
    return `${msg}\t${key}: ${value}\r\n`;
  }, `${errorData.name}:\r\n`);

const consoleLogError = (error, isCriticalError, requestId) => {
  if (!["development", "test"].includes(process.env.NODE_ENV)) return;
  
  const errorData = error.getLoggerObject(requestId);
  const prettyErrorMessage = makePrettyErrorMessage(errorData);
  const consoleColor = isCriticalError ? "\x1b[31m" : "\x1b[33m"; // Red for critical, Yellow for others
  console.log(consoleColor, prettyErrorMessage);
};

export const pushErrorMsg = (error, requestId) => {
  const err = error instanceof HRCustomError ? error : new InternalServerError(error);
  const isCriticalError = config.criticalErrorTypes.includes(err.name);

  // Log all errors to console with appropriate color
  consoleLogError(err, isCriticalError, requestId);

  // Send email only for critical errors
  if (isCriticalError) {
    sendEmail(ERROR_NOTIFICATION, err.getLoggerObject(requestId, true), config.adminEmails).catch(console.error);
  }
};

export const handleLoggingForNoAwaitTask = (requestId) => (err) => {
  const errorForLogging = new InternalServerError(err);
  pushErrorMsg(errorForLogging, requestId);
};
