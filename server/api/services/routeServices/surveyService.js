import mongoose from "mongoose";
import Surveys from "../../model/schemas/surveys.js";

export const createSurvey = async (createData) => {
  const { email, link } = createData;
  if (!email || !link) {
    return { message: "Missing credentials for survey" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { message: "Invalid email format" };
  }
  const linkRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (!linkRegex.test(link)) {
    return { message: "Invalid link format" };
  }
  const survey = await Surveys.findOne({ email, link, isCompleted: true });
  if (survey) {
    return { message: "Survey already exist and completed" };
  }
  return await Surveys.create(createData);
};

export const getSurveysByEmail = async (email) => {
  return await Surveys.find({ email });
};

export const getSurveyById = async (id) => {
  return await Surveys.findOne({ _id: new mongoose.Types.ObjectId(id) });
};

export const updateSurveyById = async (id, body) => {
  const { answer, isCompleted, isConfirmed } = body;
  const survey = await getSurveyById(id);
  if (!survey) {
    return { message: "Survey not found" };
  }
  const updateData = {};
  if (answer) {
    survey.answers.push(answer);
    updateData.answers = survey.answers;
  }
  if (isCompleted !== undefined) {
    updateData.isCompleted = isCompleted;
  }
  if (isConfirmed !== undefined) {
    updateData.isConfirmed = isConfirmed;
  }
  return await Surveys.updateOne({ _id: new mongoose.Types.ObjectId(id) }, updateData);
};

export const deleteSurveyById = async (id) => {
  return await Surveys.findOne({ _id: new mongoose.Types.ObjectId(id) }).deleteOne();
};
