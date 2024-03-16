import { DbClient } from "../../../../scripts/db/dbclient/dbclient";
import { DB_CONN_STRING, DB_NAME } from "../../../../scripts/env/enviromentdb";
import { isProduction } from "../../../config";
import { predictWithIntialUserCreateAccount } from "./RecommendationScript";

DbClient.useOptions({
  url: DB_CONN_STRING,
  dbName: DB_NAME,
  mongoClientOptions: {
    monitorCommands: isProduction,
  },
});
DbClient.instance.createIndexWork();
DbClient.instance.createIndexUser();
predictWithIntialUserCreateAccount();
