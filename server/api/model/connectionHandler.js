import moment from "moment";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import { cLog } from "../services/innerServices/loggerHandler.js";
import { InternalServerError } from "../services/innerServices/errors/CustomErrors.js";
import config from "../config.js";

const { IS_LOCAL_MONGO_DB, MONGO_DB_USER_NAME, MONGO_DB_SECRET_KEY, MONGO_DB_NAME, NODE_ENV } = process.env;

let mongoMemoryServer;

const generateMongoUri = async () => {
  if (NODE_ENV === "test") {
    mongoMemoryServer = await MongoMemoryReplSet.create({
      replSet: {
        count: 1,
        storageEngine: "wiredTiger"
      }
    });

    return mongoMemoryServer.getUri();
  }

  const mongoUri = IS_LOCAL_MONGO_DB
    ? `mongodb://localhost:27017/${config.HR_DB_NAME}?replicaSet=rs0`
    : // eslint-disable-next-line max-len
      `mongodb+srv://${MONGO_DB_USER_NAME}:${MONGO_DB_SECRET_KEY}@${MONGO_DB_NAME}.mongodb.net/${config.DB_NAME}?retryWrites=true&w=majority`;

  return mongoUri;
};

export const connectToMongoDB = async () => {
  try {
    const mongoUri = await generateMongoUri();
    mongoose.connect(mongoUri, {
      family: 4,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    cLog(
      `**Server** - ${IS_LOCAL_MONGO_DB ? "**Local mongoDB**" : "**Remote MongoDB**"} connection to mongo is up. DB name => ${
        config.DB_NAME
      }`
    );
  } catch (err) {
    cLog(`Connection to mongo failed. Server is not running ${moment().format("DD/MM/YYYY HH:mm:ss")}`);
    throw new InternalServerError(err);
  }
};

export const disconnectFromMongoDB = async () => {
  if (mongoMemoryServer) {
    mongoMemoryServer.stop();
    mongoMemoryServer = null;
  }

  await mongoose.disconnect();
};
