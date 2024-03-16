import { ObjectId } from "mongodb";
import { DbClient } from "../../../../scripts/db/dbclient/dbclient";
import {
  NotificationObject,
  RecordNotificationReceiver,
  RecordNotificationSender,
} from "../../../infrastructure/dbStore/models/Notification";

export interface INotificationRepo {
  saveNotificationObject(object: NotificationObject): Promise<void>;
  saveRecordNotificationSender(
    objectRecord: RecordNotificationSender
  ): Promise<void>;
  saveRecordNotificationReceiver(
    objectRecord: RecordNotificationReceiver
  ): Promise<void>;
  findNotificationIdReceiver(
    id: ObjectId
  ): Promise<RecordNotificationReceiver[] | null>;
}

export class NotificationRepo implements INotificationRepo {
  public async saveNotificationObject(
    object: NotificationObject
  ): Promise<void> {
    await DbClient.instance.collections.notificationObject.insertOne(object);
  }
  public async saveRecordNotificationReceiver(
    objectRecord: RecordNotificationReceiver
  ): Promise<void> {
    await DbClient.instance.collections.notificationReceiver.insertOne(
      objectRecord
    );
  }
  public async saveRecordNotificationSender(
    objectRecord: RecordNotificationSender
  ): Promise<void> {
    await DbClient.instance.collections.notificationSender.insertOne(
      objectRecord
    );
  }
  public async findNotificationIdReceiver(
    id: ObjectId
  ): Promise<RecordNotificationReceiver[] | null> {
    const list = await DbClient.instance.collections.notificationReceiver
      .find(
        {
          $and: [{ receiverId: id }],
        },
        {
          limit: 10,
        }
      )
      .toArray();
    return list;
  }
}
