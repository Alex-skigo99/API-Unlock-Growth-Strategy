import path from "path";
import ejs from "ejs";
import nodemailer from "nodemailer";
import aws from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import config from "../../../config.js";
import { REQUEST_ERROR, INVITATION_SURVEY } from "./emailEnums.js";
import { InternalServerError } from "../errors/CustomErrors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DOMPurify requires a DOM environment — jsdom provides one for server-side use
const { window } = new JSDOM("");
const DOMPurify = createDOMPurify(window);

// AWS SES transport via nodemailer — credentials loaded from environment variables
const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "eu-central-1",
  defaultProvider
});

const transporter = nodemailer.createTransport({
  SES: { ses, aws }
});

// Maps template name to a default subject line
const getSubject = (templateName) => {
  switch (templateName) {
    case REQUEST_ERROR:
      return "⚠️ Critical Error Alert";
    case INVITATION_SURVEY:
      return "You're Invited to Take a Personality Survey";
    default:
      throw new InternalServerError("Unknown email template");
  }
};

/**
 * Sends a transactional email using an EJS template.
 * HTML output is sanitized with DOMPurify to prevent XSS in email clients.
 */
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
