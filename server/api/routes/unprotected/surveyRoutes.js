import { Router } from "express";
import getQuestionnaire from "../../services/routeServices/questionnaireService.js";
import {
  getOrCreateSurvey,
  updateSurveyById,
  getSurveyAnswerNumber,
  getSurveyResult,
  saveShareEmail
} from "../../services/routeServices/surveyService.js";

const surveyRouter = Router();

surveyRouter.get("/get-questionnaire", async (_req, res, next) => {
  await getQuestionnaire()
    .then((questionnaire) => {
      return res.json(questionnaire);
    })
    .catch(next);
});

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

surveyRouter.patch("/survey/:id", async (req, res, next) => {
  const { id } = req.params;
  await updateSurveyById(id, req.body)
    .then((result) => res.json(result))
    .catch(next);
});

surveyRouter.get("/survey/:id", async (req, res, next) => {
  const { id } = req.params;
  await getSurveyAnswerNumber(id)
    .then((surveyStatus) => {
      return res.json(surveyStatus);
    })
    .catch(next);
});

surveyRouter.get("/survey/result/:id", async (req, res, next) => {
  const { id } = req.params;
  await getSurveyResult(id)
    .then((result) => res.json(result))
    .catch(next);
});

surveyRouter.post("/survey/share-email/:id", async (req, res, next) => {
  const { id } = req.params;
  await saveShareEmail(id, req.body)
    .then((result) => res.json(result))
    .catch(next);
});

export default surveyRouter;
