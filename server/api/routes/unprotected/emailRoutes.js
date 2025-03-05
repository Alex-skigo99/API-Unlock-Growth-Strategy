import { Router } from "express";
import sendEmail from "../../services/innerServices/emails/emailService.js";

const emailRouter = Router();

emailRouter.get("/send", async (_req, res, next) => {
  console.log("Start send email");
  const attachments = undefined;
  const customSubject = "Invitation";
  const receivers = "fihopa7042@jomspar.com";
  const fieldsToReplace = {
    companyLogo: "http://localhost:9718/image/sasha11@gmail.com/youtube.com-sasha11/insightgenie-icon-small.png",
    clientFirstName: "John",
    clientLink: "http://localhost:3000/?email=sasha11@gmail.com&link=youtube.com/sasha11"
  };
  await sendEmail("INVITATION_SURVEY", fieldsToReplace, receivers, attachments, customSubject)
    .then(() => {
      console.log("The letter has just been sent successfully.");
      res.json({ message: "The letter has just been sent successfully." });
    })
    .catch(next);
});

export default emailRouter;
