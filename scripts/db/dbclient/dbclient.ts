import { Db, MongoClient, ObjectId, type MongoClientOptions } from "mongodb";
import UserModel from "../../../src/infrastructure/dbStore/models/User";
import { isThursday } from "date-fns";
import { Work } from "../../../src/infrastructure/dbStore/models/Work";
import { FriendShipReq } from "../../../src/infrastructure/dbStore/models/Friend";
import {
  NotificationObject,
  RecordNotificationReceiver,
  RecordNotificationSender,
} from "../../../src/infrastructure/dbStore/models/Notification";
import { RecommendationFriend } from "../../../src/infrastructure/dbStore/models/Recommendation";

interface DbClientOptions {
  url: string;
  dbName: string;
  mongoClientOptions?: MongoClientOptions;
}

export class DbClient {
  private static _instance?: DbClient;

  private static _options?: DbClientOptions;

  private _client: MongoClient;
  private _collections: Collection;
  private constructor(option: DbClientOptions) {
    this._client = new MongoClient(option.url, option.mongoClientOptions);
    this._collections = new Collection(this._client.db(option.dbName));
  }
  public static useOptions(options: DbClientOptions) {
    this._options = options;
  }

  public static get instance() {
    if (!this._instance) {
      if (!this._options) {
        throw new Error("DbClient needs an options to construct its instance");
      }
      this._instance = new DbClient(this._options);
    }
    console.log(this._options);
    return this._instance;
  }

  public get client() {
    return this._client;
  }
  public get collections() {
    return this._collections;
  }

  public async createIndexWork() {
    await this._collections.work.createIndex({
      company: "text",
    });
  }
  public createIndexUser() {
    this._collections.users.createIndex({
      firstName: "text",
    });
  }
}

class Collection {
  constructor(private db: Db) {}
  public get users() {
    return this.db.collection<UserModel>("users");
  }
  public get work() {
    return this.db.collection<Work>("work");
  }
  public get friendShipReq() {
    return this.db.collection<FriendShipReq>("friendshipreq");
  }
  public get notificationObject() {
    return this.db.collection<NotificationObject>("notificationObject");
  }
  public get notificationSender() {
    return this.db.collection<RecordNotificationSender>(
      "recordNotificationSender"
    );
  }
  public get notificationReceiver() {
    return this.db.collection<RecordNotificationReceiver>(
      "recordNotificationReceiver"
    );
  }
  public get Recommendation() {
    return this.db.collection<RecommendationFriend>("recommendationFriend");
  }
}
