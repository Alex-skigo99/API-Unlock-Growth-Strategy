import mongoose from "mongoose";
import schemaValidators from "./schemaValidators.js";

const employeesSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      min: 2,
      max: 50,
      validate: [schemaValidators.validateEmail, "Please enter a valid email"]
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 50
    },
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50
    },
    mobile: {
      type: String,
      required: true,
      min: 8,
      max: 14
    },
    country: {
      type: String,
      required: true,
      min: 2,
      max: 30
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company"
    },
    emailConfToken: {
      type: String,
      min: 0,
      max: 100
    },
    isEmailConfirmed: {
      type: Boolean,
      required: true
    },
    status: {
      type: String,
      required: true,
      validate: [schemaValidators.isAllowedUserStatus, "Please enter a valid status"]
    },
    accessLevel: {
      type: String,
      required: true,
      validate: [schemaValidators.isAllowedAccessLevel, "Please enter a valid Access Level"]
    },
    isNewToTour: {
      type: Boolean,
      default: true
    },
    jobTitle: {
      type: String
      // required: true,
    },
    permissions: {
      type: Object
    },
    picture: {
      type: Object
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team"
    }
  },
  { timestamps: true }
);

const Employees = mongoose.model("employee", employeesSchema);

export default Employees;
