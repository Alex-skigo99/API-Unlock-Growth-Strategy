import s3pkg from "@aws-sdk/client-s3";
import bedrockPkg from "@aws-sdk/client-bedrock-runtime";
import sesPkg from "@aws-sdk/client-ses";
import { AwsError } from "../errors/CustomErrors.js";

const { S3Client, ListBucketsCommand } = s3pkg;
const { BedrockRuntimeClient } = bedrockPkg;
const { SESClient, GetSendQuotaCommand } = sesPkg;

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

// Validate required AWS credentials
const validateAwsConfig = () => {
  const missingVars = [];
  if (!AWS_REGION) missingVars.push("AWS_REGION");
  if (!AWS_ACCESS_KEY_ID) missingVars.push("AWS_ACCESS_KEY_ID");
  if (!AWS_SECRET_ACCESS_KEY) missingVars.push("AWS_SECRET_ACCESS_KEY");

  if (missingVars.length > 0) {
    throw new AwsError(`Missing required AWS environment variables: ${missingVars.join(", ")}`, 500);
  }
};

// Test AWS credentials with a simple API call for each service
const validateAwsCredentials = async (client, command, serviceName) => {
  try {
    await client.send(command);
    console.log(`Successfully validated AWS ${serviceName} credentials`);
  } catch (error) {
    if (error.name === "UnauthorizedException" || error.name === "InvalidAccessKeyId" || error.name === "SignatureDoesNotMatch") {
      throw new AwsError(`Invalid AWS credentials for ${serviceName} service: ${error.message}`, 401);
    }
    if (error.name === "AccessDeniedException") {
      throw new AwsError(`AWS credentials for ${serviceName} service lack required permissions: ${error.message}`, 403);
    }
    // For other errors (like network issues), we'll let the service start anyway
    console.warn(`Warning: Could not fully validate AWS ${serviceName} credentials:`, error.message);
  }
};

// Initialize AWS clients with error handling and credential validation
const initializeAwsClient = async (Client, config, serviceName, validationCommand) => {
  try {
    validateAwsConfig();
    const client = new Client(config);

    // Validate credentials if a validation command is provided
    if (validationCommand) {
      await validateAwsCredentials(client, validationCommand, serviceName);
    }

    return client;
  } catch (error) {
    console.error(`Failed to initialize AWS ${serviceName} client:`, error);
    if (error instanceof AwsError) {
      throw error;
    }
    throw new AwsError(`AWS ${serviceName} initialization failed: ${error.message}`, 500);
  }
};

const awsConfig = {
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
};

// Initialize clients with error handling and credential validation
const initializeClients = async () => {
  const s3Client = await initializeAwsClient(S3Client, awsConfig, "S3", new ListBucketsCommand({}));

  const bedrockClient = await initializeAwsClient(
    BedrockRuntimeClient,
    {
      ...awsConfig,
      region: process.env.AWS_REGION_AI || AWS_REGION || "us-east-1"
    },
    "Bedrock",
    null  // Skip validation for Bedrock
  );

  const sesClient = await initializeAwsClient(SESClient, awsConfig, "SES", new GetSendQuotaCommand({}));

  return { s3Client, bedrockClient, sesClient };
};

// Initialize all clients
const { s3Client, bedrockClient, sesClient } = await initializeClients();

export { s3Client, bedrockClient, sesClient };

// Helper function for exponential backoff with jitter
export const retryWithBackoff = async (operation, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries - 1) {
        if (error instanceof AwsError) {
          throw error;
        }
        throw new AwsError(`AWS operation failed after ${maxRetries} retries: ${error.message}`, 500);
      }

      const jitter = Math.random() * 1000;
      const delay = baseDelay * Math.pow(2, attempt) + jitter;
      console.log(`AWS operation failed. Retry ${attempt + 1}/${maxRetries} in ${Math.round(delay / 1000)} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
