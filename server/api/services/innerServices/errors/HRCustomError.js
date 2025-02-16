import moment from "moment";
import { convertStatusToErrorCode, getShortenedStacktrace } from "./errorUtils.js";

class HRCustomError extends Error {
  constructor(message, status, errorCode) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode || convertStatusToErrorCode(status);
    this.status = status;

    // Make message enumerable
    Object.defineProperty(this, "message", {
      value: message,
      enumerable: true
    });

    // Make stack enumerable
    Object.defineProperty(this, "stack", {
      value: this.stack,
      enumerable: true
    });
  }

  getLoggerObject(requestId, isExtended = false) {
    const errorData = {
      name: this.name,
      errorCode: this.errorCode,
      status: this.status,
      message: this.message,
      stacktrace: isExtended ? this.stack : getShortenedStacktrace(this.stack),
      loggedAt: moment().format("DD/MM/YYYY HH:mm")
    };

    if (requestId) {
      errorData.requestId = requestId;
    }

    if (isExtended) {
      errorData.nodeEnv = process.env.NODE_ENV;
    }

    return errorData;
  }

  convertToResponse() {
    return {
      success: false,
      errorCode: this.errorCode,
      msg: this.message
    };
  }
}

export default HRCustomError;
