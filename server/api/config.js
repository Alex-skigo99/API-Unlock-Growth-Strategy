const config = {
  /* RATE LIMIT HANDLER */
  limitWindowMs: 60 * 60 * 1000,
  maxReqAmount: 1000,

  /* EMAIL SERVICE */
  emailDoNotReply: "InsightGenie HR <do-not-reply@hr.insightgenie.ai>",

  supportEmail: "itaybkk10@gmail.com",

  /* ERRORS HANDLING */
  criticalErrorTypes: ["InternalServerError", "TooManyRequestsError", "UnhandledExternalProviderError", "AwsError", "AiError"],

  /* MONGO DB */
  DB_NAME: "PersonalityCollectionDb",

  /* INSIGHT GENIE LOGO URL */
  INSIGHT_GENIE_LOGO_URL: "https://indexing-bizbaz.s3.ap-southeast-1.amazonaws.com/insightgenie-logo-white.png",

  webDomain: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "YOUR DOMAIN HERE",

  // BCRYPT
  saltRounds: 10,

  apiUrl: process.env.NODE_ENV === "development" ? `http://localhost:${process.env.SERVER_PORT ?? 9718}` : "YOUR API URL HERE"
};

export default config;
