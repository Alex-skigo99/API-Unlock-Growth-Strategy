import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getOrCreateSurvey } from "../../services/routeServices/surveyService.js";

const imageRouter = Router();

/**
 * Email tracking pixel route.
 * When the invitation email loads its logo image, this endpoint is hit,
 * which initialises a survey instance in the database (if not already created).
 * The email and YouTube channel link are encoded in the URL path.
 */
imageRouter.get("/:email/:link/:filename", async (req, res, next) => {
  let { email, link, filename } = req.params;
  link = link.replace("-", "/");
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const imagePath = path.join(__dirname, "../../assets/images", filename);
  getOrCreateSurvey({ email, link, isWebsiteOpened: false });
  res.sendFile(imagePath);
});

export default imageRouter;
