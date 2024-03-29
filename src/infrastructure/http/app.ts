import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { isProduction } from "../../config";
import { v1Route } from "../../webapi/api/v1";
import { DbClient } from "../../../scripts/db/dbclient/dbclient";
import { DB_CONN_STRING, DB_NAME } from "../../../scripts/env/enviromentdb";
import cookieParser from "cookie-parser";
import { ObjectId } from "mongodb";
import CloundinaryService from "../service/Cloundinary";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import http from "http";
import socketIO from "./stocket.io";
declare global {
  namespace Express {
    interface Request {
      userId?: ObjectId;
      io?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
    }
  }
}
const app = express();

const origin = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};
DbClient.useOptions({
  url: DB_CONN_STRING,
  dbName: DB_NAME,
  mongoClientOptions: {
    monitorCommands: isProduction,
  },
});
DbClient.instance.createIndexWork();
DbClient.instance.createIndexUser();

CloundinaryService.useOptionCloundinaryService({
  api_key: "471463573585662",
  api_secret: "m8A6vv5mTqg7bBW-uY-E0S3gYy0",
  cloud_name: "dgmss9oy4",
  basePath: "social_app",
});
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(origin));
app.use(compression());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("combined"));
app.use(cookieParser());

const server = http.createServer(app);
socketIO(server);
app.use("/api/v1", v1Route);
server.listen(8080, () => {
  console.log(`[App]: Server listening on 8080`);
});

export { app };
