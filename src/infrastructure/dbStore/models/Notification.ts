import { Document, ObjectId } from "mongodb";
import { EntityType, StatusReceiver } from "./enum/EntityType";

export interface EntityNotification {
  id: ObjectId;
  name: string;
}
export interface NotificationObject extends Document {
  entityIid: EntityNotification;
  entity_type: EntityType;
  dateCr: Date;
}

export interface RecordNotificationSender extends Document {
  notificationId: ObjectId;
  actorId: ObjectId;
  dateCr: Date;
}

export interface RecordNotificationReceiver extends Document {
  notificationId: ObjectId;
  receiverId: ObjectId;
  dateCr: Date;
  status: StatusReceiver;
}
