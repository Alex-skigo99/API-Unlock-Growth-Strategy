import { Router } from "express";
import getQuestionnaire from "../../services/routeServices/questionnaireService.js";
import { createSurvey, updateSurveyById, getSurveyById } from "../../services/routeServices/surveyService.js";

const mainRouter = Router();

mainRouter.get("/get-questionnaire", async (_req, res, next) => {
  await getQuestionnaire()
    .then((questionnaire) => {
      res.json(questionnaire);
    })
    .catch(next);
});

mainRouter.post("/survey", async (req, res, next) => {
  const { email, link } = req.body;
  await createSurvey({ email, link })
    .then((survey) => {
      if (survey.message) {
        return res.status(200).json(survey);
      }
      res.status(201).json(survey);
    })
    .catch(next);
});

mainRouter.patch("/survey/:id", async (req, res, next) => {
  const { id } = req.params;
  await updateSurveyById(id, req.body)
    .then((survey) => {
      if (survey.message) {
        return res.status(200).json(survey);
      }
      res.json(survey);
    })
    .catch(next);
});

export default mainRouter;
