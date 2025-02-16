import { TooManyRequestsError } from "../../services/innerServices/errors/CustomErrors.js";

export default function rateLimitHandler() {
  throw new TooManyRequestsError("Too many requests, please try again later.");
}
