import jwt from "jsonwebtoken";
import { PermissionError } from "./errors/CustomErrors.js";

const generateGenericAuthenticationFunction = (secret, expiresIn) => (tokenData) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      tokenData,
      secret,
      {
        expiresIn
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });

// eslint-disable-next-line import/prefer-default-export
export const generateAuthToken = generateGenericAuthenticationFunction(process.env.JWT_AUTH_TOKEN_SECRET, "12h");

// MAKE SURE TO CREATE NEW AUTH GENERATOR FOR EACH NEW TOKEN TYPE AS BELOW
// export const generateAuthTokenForgotPassword = generateGenericAuthenticationFunction(process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET, "1h");

// export const generateAuthTokenEmailVerification = generateGenericAuthenticationFunction(
//   process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
//   `${config.emailShouldBeVerifiedInXHours}h`
// );

export const jwtVerification = (token, tokenSecret) => {
  try {
    const tokenData = jwt.verify(token, tokenSecret);
    return tokenData;
  } catch (err) {
    switch (err.name) {
      case "JsonWebTokenError":
        throw new PermissionError("Invalid Bearer Token. Needs Login.");
      case "TokenExpiredError": {
        throw new PermissionError("Session Expired. Needs Login.");
      }
      default:
        throw err;
    }
  }
};
