import mongoose from "mongoose";
import { pushErrorMsg } from "../../services/innerServices/loggerHandler.js";
import RequestHistory from "../../model/schemas/requestHistory.js";

const createRequestPayloadFromBody = (reqBody) => {
  const requestPayload = structuredClone(reqBody);

  delete requestPayload.password;
  delete requestPayload.secret;

  return requestPayload;
};

const objIsEmpty = (obj) => Object.keys(obj).length === 0;

const endLogger = async (req) => {
  try {
    const ld = req.loggerData;
    ld.durationMsInServer = Date.now() - ld.dateCreated.getTime();

    if (objIsEmpty(ld.requestPayload)) {
      delete ld.requestPayload;
    }

    delete ld.dateCreated;
    await RequestHistory.create(ld);
  } catch (err) {
    pushErrorMsg(err, req.loggerData?._id);
  }
};

const requestLogger = (req, res, next) => {
  res.once("finish", () => endLogger(req));

  const dateCreated = new Date();
  const requestId = new mongoose.Types.ObjectId();
  const fp = req.fingerprint;
  const reqPath = `[${req.method}]: ${req.originalUrl}`;

  const userIp =
    (req.headers["x-forwarded-for"] || "").split(",").shift().trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const loggerData = {
    _id: requestId,
    dateCreated,
    ip: userIp,
    path: reqPath,
    browser: fp.components.useragent.browser.family,
    browserVer: fp.components.useragent.browser.version,
    os: fp.components.useragent.os.family,
    osVer: `${fp.components.useragent.os.major}/${fp.components.useragent.os.minor}`
  };

  const requestPayload = createRequestPayloadFromBody(req.body);
  loggerData.requestPayload = requestPayload;

  req.loggerData = loggerData;
  req.userIp = userIp; // this is for express-rate-limit lab

  next();
};

export default requestLogger;
