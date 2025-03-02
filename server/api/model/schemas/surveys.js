import mongoose from "mongoose";
import schemaValidators from "./schemaValidators.js";

const surveysSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId() },
    email: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
      // validate: [schemaValidators.validateEmail, "Please enter a valid email"]
    },
    link: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 150
    },
    answers: {
      type: Array
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    isConfirmed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Surveys = mongoose.model("surveys", surveysSchema);

export default Surveys;
