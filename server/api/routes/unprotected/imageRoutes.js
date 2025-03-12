import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getOrCreateSurvey } from "../../services/routeServices/surveyService.js";

const imageRouter = Router();

imageRouter.get("/:email/:link/:filename", async (req, res, next) => {
  let { email, link, filename } = req.params;
  link = link.replace("-", "/");
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const imagePath = path.join(__dirname, "../../assets/images", filename);
  getOrCreateSurvey({ email, link, isWebsiteOpened: false });
  res.sendFile(imagePath);
});

export default imageRouter;
