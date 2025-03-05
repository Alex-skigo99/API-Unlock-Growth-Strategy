import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createSurvey } from "../../services/routeServices/surveyService.js";

const imageRouter = Router();

imageRouter.get("/:email/:link/:filename", async (req, res, next) => {
  let { email, link, filename } = req.params;
  link = link.replace("-", "/");
  console.log("email", email);
  console.log("link", link);
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const imagePath = path.join(__dirname, "../../assets/images", filename);
  console.log("imagePath", imagePath);
  createSurvey({ email, link });
  res.sendFile(imagePath);
});

export default imageRouter;
