import { NotificationEntity } from "../../../core/domain/NotificationEntity";
import {
  NotificationObject,
  RecordNotificationReceiver,
  RecordNotificationSender,
} from "../../../infrastructure/dbStore/models/Notification";
import { ObjectId } from "mongodb";
import { EntityType } from "../../../infrastructure/dbStore/models/enum/EntityType";

export class FriendShip extends NotificationEntity {
  public CreateRecordEntitySender(): RecordNotificationSender {
    const sender: RecordNotificationSender = {
      actorId: this.actorId,
      dateCr: new Date(),
      notificationId: this._id.toValue() as ObjectId,
    };
    return sender;
  }
  public CreateEntityObject(
    type: EntityType,
    name: string
  ): NotificationObject {
    const object: NotificationObject = {
      dateCr: new Date(),
      entityIid: {
        id: new ObjectId(),
        name: name,
      },
      entity_type: type,
    };
    object._id = this._id.toValue();
    return object;
  }
  public CreateRecordEnityReceiver(): RecordNotificationReceiver {
    const receiver: RecordNotificationReceiver = {
      dateCr: new Date(),
      notificationId: this._id.toValue() as ObjectId,
      receiverId: this.receiverId,
      status: 1,
    };
    return receiver;
  }
}
