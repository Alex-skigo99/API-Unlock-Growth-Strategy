import { ValidationError } from "../../services/innerServices/errors/CustomErrors.js";

// This middleware is used to catch errors that are thrown before the request reaches the route handler.
// e.g. an error in the http request itself like a poorly formatted json.
const earlyOnsetErrorHandler = (err, _req, _res, next) => {
  try {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      // checks if request json is the proper format.
      throw new ValidationError(err.message);
    } else if (err.name === "PayloadTooLargeError" && err.status === 413) {
      // checks if request json is the proper format.
      throw new ValidationError("The request entity or body is too large!", 413);
    }

    next(err);
  } catch (error) {
    next(error);
  }
};

export default earlyOnsetErrorHandler;
