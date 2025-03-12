import mongoose from "mongoose";
import Surveys from "../../model/schemas/surveys.js";
import ShareEmails from "../../model/schemas/shareEmails.js";
import { askGroq } from "../innerServices/groqService.js";
import { groqBasePrompt } from "../innerServices/groqBasePrompt.js";

export const getOrCreateSurvey = async (createData) => {
  const { email, link, isWebsiteOpened } = createData;
  if (!email || !link) {
    return { message: "Missing credentials for survey" };
  }
  let survey = await Surveys.findOne({ youtubersEmail: email, youtubersChannelLink: link, isSurveyCompleted: false });
  if (!survey) {
    survey = await Surveys.create({ youtubersEmail: email, youtubersChannelLink: link, isWebsiteOpened });
  } else {
    if (isWebsiteOpened) {
      await Surveys.updateOne({ _id: survey._id }, { isWebsiteOpened });
    }
  }
  return { _id: survey._id };
};

export const updateSurveyById = async (id, body) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { message: "Invalid survey ID" };
  }
  const { answer, isSurveyCompleted, isChannelLinkConfirmed, newYoutubersChannelLink } = body;
  const survey = await Surveys.findOne({ _id: new mongoose.Types.ObjectId(id) });
  if (!survey) {
    return { message: "Survey not found" };
  }
  const updateData = {};
  if (answer) {
    answer.createdAt = new Date();
    survey.surveyAnswers.push(answer);
    updateData.surveyAnswers = survey.surveyAnswers;
  }
  if (isSurveyCompleted !== undefined) {
    updateData.isSurveyCompleted = isSurveyCompleted;
  }
  if (isChannelLinkConfirmed !== undefined) {
    updateData.isChannelLinkConfirmed = isChannelLinkConfirmed;
  }
  if (newYoutubersChannelLink) {
    updateData.previousLinks = survey.previousLinks || [];
    updateData.previousLinks.push(survey.youtubersChannelLink);
    updateData.youtubersChannelLink = newYoutubersChannelLink;
  }
  const result = await Surveys.updateOne({ _id: new mongoose.Types.ObjectId(id) }, updateData);
  return result;
};

export const getSurveyAnswerNumber = async (id) => {
  const survey = await Surveys.findOne({ _id: new mongoose.Types.ObjectId(id) });
  if (!survey) {
    return { message: "Survey not found" };
  }
  const result = {
    currentAnswerNumber: survey.surveyAnswers ? survey.surveyAnswers.length : 0,
    isSurveyCompleted: survey.isSurveyCompleted || false,
    isChannelLinkConfirmed: survey.isChannelLinkConfirmed || false
  };
  return result;
};

export const getSurveyResult = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { message: "Invalid survey ID" };
  }
  const survey = await Surveys.findOne({ _id: new mongoose.Types.ObjectId(id), isSurveyCompleted: true });
  if (!survey) {
    return { message: "Survey not found" };
  }
  let prompt = groqBasePrompt;
  prompt += "[";
  prompt += survey.surveyAnswers
    .map((answer) => {
      return `{
      "question": "${answer.question}",
      "answer": "${answer.valueText}"
    }`;
    })
    .join(",\n");
  prompt += `]`;
  let result = await askGroq(prompt);
  const startJson = result.indexOf("{");
  const endJson = result.lastIndexOf("}");
  result = JSON.parse(result.slice(startJson, endJson + 1));

  return { youtubersEmail: survey.youtubersEmail, youtubersChannelLink: survey.youtubersChannelLink, result };
};

export const saveShareEmail = async (id, body) => {
  const { email } = body;
  const emailData = { email };
  if (mongoose.Types.ObjectId.isValid(id)) {
    emailData.surveyId = id;
  }
  const result = await ShareEmails.create(emailData);
  return !!result ? { message: "Email saved" } : { message: "Email not saved" };
};
