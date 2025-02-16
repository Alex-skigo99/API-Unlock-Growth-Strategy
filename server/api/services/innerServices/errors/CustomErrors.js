/* eslint-disable default-param-last */
// this needs to be enabled because although errorCode does not have a default value as a parameter,
// it still has a default value which is calculated in the HRCustomError class and is dependent on the status.
// So one could put a status and not put an errorCode and is not likely to need to put an errorCode without a status.

import HRCustomError from "./HRCustomError.js";

const MESSAGE_FOR_INTERNAL_SERVER_ERROR = "Something went wrong, please try again later.";

export class ValidationError extends HRCustomError {
  constructor(message, status = 400, errorCode) {
    super(message, status, errorCode);
  }
}

export class PermissionError extends HRCustomError {
  constructor(message, status = 401, errorCode) {
    super(message, status, errorCode);
  }
}

export class DatabaseError extends HRCustomError {
  constructor(message, status = 404, errorCode) {
    super(message, status, errorCode);
  }
}

export class TooManyRequestsError extends HRCustomError {
  constructor(message, status = 429, errorCode) {
    super(message, status, errorCode);
  }
}

export class MaintenanceError extends HRCustomError {
  constructor(message = "This endpoint is currently under maintenance, please try again later.", status = 503, errorCode) {
    super(message, status, errorCode);
  }
}

export class ExternalProviderError extends HRCustomError {
  constructor(provider, message, status = 400, errorCode) {
    super(message, status, errorCode);
    this.provider = provider;
  }

  getLoggerObject(requestId, isStackTraceExtended) {
    const errorData = super.getLoggerObject(requestId, isStackTraceExtended);
    errorData.provider = this.provider;
    return errorData;
  }
}

export class UnhandledExternalProviderError extends ExternalProviderError {
  constructor(provider, err, status = 500) {
    super(provider, MESSAGE_FOR_INTERNAL_SERVER_ERROR, status);
    this.originalMessage = err.message;
    this.originalName = err.name;
    this.stack = err.stack;
    const errorData = err.response?.data ?? {};

    try {
      if (typeof errorData === "object") {
        this.originalErrorData = JSON.stringify(errorData);
      } else {
        this.originalErrorData = String(errorData);
      }
    } catch {
      this.originalErrorData = "Error while stringifying original error data";
    }
  }

  getLoggerObject(requestId, isExtended) {
    const errorData = super.getLoggerObject(requestId, isExtended);
    errorData.originalMessage = this.originalMessage;
    errorData.originalName = this.originalName;
    errorData.originalErrorData = this.originalErrorData;
    return errorData;
  }
}

export class InternalServerError extends HRCustomError {
  constructor(errOrMsg, status = 500) {
    super(MESSAGE_FOR_INTERNAL_SERVER_ERROR, status);
    this.originalMessage = errOrMsg.message ?? errOrMsg;
    this.originalName = errOrMsg.name ?? "Thrown In Code";
    this.stack = errOrMsg.stack ?? this.stack;
  }

  getLoggerObject(requestId, isExtended) {
    const errorData = super.getLoggerObject(requestId, isExtended);
    errorData.originalName = this.originalName;
    errorData.originalMessage = this.originalMessage;
    return errorData;
  }
}

export class AiError extends HRCustomError {
  constructor(message, status = 500, errorCode) {
    super(message, status, errorCode);
  }
}

export class FileError extends HRCustomError {
  constructor(message, status = 400, errorCode) {
    super(message, status, errorCode);
  }
}

export class AwsError extends HRCustomError {
  constructor(message, status = 500, errorCode) {
    super(message, status, errorCode);
  }
}
