import mongoose from "mongoose";

const surveysSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, default: () => new mongoose.Types.ObjectId() },
    youtubersEmail: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    youtubersChannelLink: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 200
    },
    previousLinks: {
      type: Array
    },
    surveyAnswers: {
      type: Array
    },
    selfAwarenessAnswers: {
      type: Array
    },
    currentAnswerNumber: {
      type: Number,
      default: 0
    },
    isWebsiteOpened: {
      type: Boolean,
      default: false
    },
    isSurveyCompleted: {
      type: Boolean,
      default: false
    },
    isChannelLinkConfirmed: {
      type: Boolean,
      default: false
    },
    result: {
      type: Object
    }
  },
  { timestamps: true }
);

const Surveys = mongoose.model("surveys", surveysSchema);

export default Surveys;
