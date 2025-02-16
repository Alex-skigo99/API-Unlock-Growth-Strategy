import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "production-dev") {
  const envConfig = process.env.NODE_ENV === "test" ? { path: "../.env" } : {};
  dotenv.config(envConfig);
}
