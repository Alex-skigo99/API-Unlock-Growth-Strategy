import mongoose from "mongoose";

const shareEmailsSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId() },
    email: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    link: {
      type: String,
      minlength: 2,
      maxlength: 200
    },
    surveyId: {
      type: String,
      maxlength: 50
    }
  },
  { timestamps: true }
);

const ShareEmails = mongoose.model("shareEmails", shareEmailsSchema);

export default ShareEmails;
