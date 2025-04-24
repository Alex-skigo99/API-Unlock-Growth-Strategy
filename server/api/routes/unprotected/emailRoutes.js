import { Router } from "express";
import sendEmail from "../../services/innerServices/emails/emailService.js";

const emailRouter = Router();

emailRouter.get("/send", async (_req, res, next) => {
  const attachments = undefined;
  const customSubject = "Invitation";
  const receivers = "refoned803@dwriters.com";
  const fieldsToReplace = {
    companyLogo: "http://localhost:9718/image/sasha@gmail.com/youtube.com-sasha/insightgenie-icon-small.png",
    clientFirstName: "John",
    clientLink: "http://localhost:3000/?email=sasha@gmail.com&link=youtube.com/sasha"
  };
  await sendEmail("INVITATION_SURVEY", fieldsToReplace, receivers, attachments, customSubject)
    .then(() => {
      res.json({ message: "The letter has just been sent successfully." });
    })
    .catch(next);
});

export default emailRouter;
