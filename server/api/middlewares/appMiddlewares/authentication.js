import { PermissionError } from "../../services/innerServices/errors/CustomErrors.js";
import { jwtVerification } from "../../services/innerServices/encryptionService.js";

const { JWT_AUTH_TOKEN_SECRET } = process.env;

// eslint-disable-next-line import/prefer-default-export
export function verifyToken(req, _res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new PermissionError("Needs Login.");
  }

  const tokenData = jwtVerification(token, JWT_AUTH_TOKEN_SECRET);

  req.tokenData = tokenData;

  next();
}