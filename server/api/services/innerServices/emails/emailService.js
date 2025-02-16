import path from "path";
import ejs from "ejs";
import nodemailer from "nodemailer";
import aws from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node"; // This searches in the .env file for credentials with the default names
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import config from "../../../config.js";
import { APPLICATION_RECEIVED, ERROR_NOTIFICATION, REQUEST_ERROR } from "./emailEnums.js";
import { InternalServerError } from "../errors/CustomErrors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { window } = new JSDOM("");

const DOMPurify = createDOMPurify(window);
const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "eu-central-1",
  defaultProvider
});

const transporter = nodemailer.createTransport({
  SES: { ses, aws }
});

const getSubject = (templateName) => {
  switch (templateName) {
    case ERROR_NOTIFICATION:
      return "⚠️ Critical Error Alert - HR API";
    case REQUEST_ERROR:
      return "Request Error";
    case APPLICATION_RECEIVED:
      return "We got it! Thank you for your application";

    default:
      throw new InternalServerError("Unknown email template");
  }
};

const sendEmail = async (templateName, fieldsToReplace, receivers, attachments, customSubject) => {
  const subject = customSubject || getSubject(templateName);
  const ejsFilePath = path.join(__dirname, `./emailTemplates/${templateName}.ejs`);
  const html = await ejs.renderFile(ejsFilePath, fieldsToReplace, { async: true });
  const sanitizedHtml = DOMPurify.sanitize(html);

  const emailOptions = {
    from: config.emailDoNotReply,
    to: receivers,
    subject,
    html: sanitizedHtml
  };

  if (attachments) {
    emailOptions.attachments = attachments;
  }

  await transporter.sendMail(emailOptions);
};

export default sendEmail;
