import { Db, MongoClient, ObjectId, type MongoClientOptions } from "mongodb";
import UserModel from "../../../src/infrastructure/sequelize/models/User";
import { isThursday } from "date-fns";
import { Work } from "../../../src/infrastructure/sequelize/models/Work";

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
}
