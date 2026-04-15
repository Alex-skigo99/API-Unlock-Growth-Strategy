import { Router } from "express";
import { questionnaire } from "../../assets/Questions-for-survey.js";
import {
  getOrCreateSurvey,
  updateSurveyById,
  getSurveyAnswerNumber,
  getSurveyResult,
  saveShareEmail
} from "../../services/routeServices/surveyService.js";

const surveyRouter = Router();

// Returns the full ordered list of survey questions (Big 5 self-awareness + personality)
surveyRouter.get("/get-questionnaire", async (_req, res, next) => {
  res.json(questionnaire);
});

// Creates or retrieves an existing survey instance for the given email + channel
surveyRouter.post("/survey", async (req, res, next) => {
  await getOrCreateSurvey(req.body)
    .then((surveyData) => {
      if (surveyData.message) {
        return res.status(200).json(surveyData);
      }
      return res.status(201).json(surveyData);
    })
    .catch(next);
});

// Saves an individual answer, marks survey complete, or confirms channel link
surveyRouter.patch("/survey/:id", async (req, res, next) => {
  const { id } = req.params;
  await updateSurveyById(id, req.body)
    .then((result) => res.json(result))
    .catch(next);
});

// Returns current survey progress (answer number + completion flags)
surveyRouter.get("/survey/:id", async (req, res, next) => {
  const { id } = req.params;
  await getSurveyAnswerNumber(id)
    .then((surveyStatus) => {
      return res.json(surveyStatus);
    })
    .catch(next);
});

// Fetches the AI-generated personality report for a completed survey
surveyRouter.get("/survey/result/:id", async (req, res, next) => {
  const { id } = req.params;
  await getSurveyResult(id)
    .then((result) => res.json(result))
    .catch(next);
});

// Saves a "share with a friend" email address for the referral flow
surveyRouter.post("/survey/share-email/:id", async (req, res, next) => {
  const { id } = req.params;
  await saveShareEmail(id, req.body)
    .then((result) => res.json(result))
    .catch(next);
});

export default surveyRouter;
