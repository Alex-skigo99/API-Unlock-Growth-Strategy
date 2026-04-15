import { Router } from "express";
import sendEmail from "../../services/innerServices/emails/emailService.js";

const emailRouter = Router();

// Development helper — sends a test invitation email with hardcoded data
emailRouter.get("/send", async (_req, res, next) => {
  const attachments = undefined;
  const customSubject = "Invitation";
  const receivers = "k2y36@deltajohnsons.com";
  const fieldsToReplace = {
    companyLogo: "http://localhost:9718/image/sasha26@gmail.com/youtube.com-sasha-26/insightgenie-icon-small.png",
    clientFirstName: "John",
    clientLink: "http://localhost:3000/?email=sasha26@gmail.com&link=youtube.com/sasha-26"
  };
  await sendEmail("INVITATION_SURVEY", fieldsToReplace, receivers, attachments, customSubject)
    .then(() => {
      res.json({ message: "The letter has just been sent successfully." });
    })
    .catch(next);
});

export default emailRouter;
