const config = {
  // Rate limiting: max requests per IP within the time window
  limitWindowMs: 60 * 60 * 1000, // 1 hour
  maxReqAmount: 1000,

  // Email sender identity for transactional emails (AWS SES)
  emailDoNotReply: "InsightGenie <do-not-reply@insightgenie.ai>",
  supportEmail: "itaybkk10@gmail.com",

  // Error types that trigger admin email notifications
  criticalErrorTypes: ["InternalServerError", "TooManyRequestsError", "UnhandledExternalProviderError", "AwsError", "AiError"],

  // MongoDB database name
  DB_NAME: "PersonalityCollectionDb",

  // Public logo URL used in invitation emails
  INSIGHT_GENIE_LOGO_URL: "https://indexing-bizbaz.s3.ap-southeast-1.amazonaws.com/insightgenie-logo-white.png",

  // Frontend domain — used for building survey links in emails
  webDomain: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "YOUR DOMAIN HERE",

  // Backend API base URL
  apiUrl: process.env.NODE_ENV === "development" ? `http://localhost:${process.env.SERVER_PORT ?? 9718}` : "YOUR API URL HERE"
};

export default config;
