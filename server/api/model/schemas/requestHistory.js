import mongoose from "mongoose";

const requestHistorySchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId, // Manually assigned ObjectId
    durationMsInServer: { type: Number, required: true }, // in milliseconds
    ip: { type: String, required: true }, // x-forwarded-for header
    path: {
      type: String,
      required: true
    },
    browser: { type: String, required: true },
    browserVer: { type: String, required: true },
    os: { type: String, required: true },
    osVer: { type: String, required: true },
    requestPayload: {
      type: Object, // Can store JSON-like data
      default: {}
    }
  },
  { timestamps: true }
);

const RequestHistory = mongoose.model("requestHistory", requestHistorySchema, "requestHistory");

export default RequestHistory;
