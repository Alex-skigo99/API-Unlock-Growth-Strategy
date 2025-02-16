import mongoose from "mongoose";

const errorLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "AwsError",
        "AiError",
        "FileError",
        "ValidationError",
        "PermissionError",
        "DatabaseError",
        "TooManyRequestsError",
        "MaintenanceError",
        "ExternalProviderError",
        "UnhandledExternalProviderError",
        "InternalServerError"
      ],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    stack: String,
    statusCode: Number,
    // Request info
    path: String,
    method: String,
    // User info (if available)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    // Error source
    service: {
      type: String,
      enum: [
        "system",
        "auth",
        "applicant-interviews",
        "appointment-for-applicant",
        "inquiry",
        "professional-references",
        "recruiter",
        "company",
        "jobs",
        "interviewConfigurations",
        "applicant-reports",
        "ask-ai",
        "appointments",
        "post-jobs",
        "google-calendar-events",
        "dashboard",
        "dev-services",
        "admin",
        "aws",
        "employee",
        "other"
      ],
      required: true
    },
    // Additional context
    metadata: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Simple index for querying
errorLogSchema.index({ type: 1, createdAt: -1 });
errorLogSchema.index({ service: 1, createdAt: -1 });

const ErrorLogs = mongoose.model("ErrorLogs", errorLogSchema);

export default ErrorLogs;
