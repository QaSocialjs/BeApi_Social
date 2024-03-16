import { ObjectId } from "mongodb";
import {
  NotificationObject,
  RecordNotificationReceiver,
  RecordNotificationSender,
} from "../../infrastructure/dbStore/models/Notification";
import { AggregateRoot } from "./AggragateRoot";
import { UniqueEntityId } from "./UniqueEntityId";
import { EntityType } from "../../infrastructure/dbStore/models/enum/EntityType";

interface NotificationProps {
  actorId: ObjectId;
  receiverId: ObjectId;
}
export abstract class NotificationEntity extends AggregateRoot<NotificationProps> {
  constructor(notiProps: NotificationProps, id?: UniqueEntityId) {
    super(notiProps, id);
  }
  get id() {
    return this._id;
  }
  get actorId(): ObjectId {
    return this.props.actorId;
  }
  get receiverId(): ObjectId {
    return this.props.receiverId;
  }
  public CreateRecordEntitySender(): any {}
  public CreateEntityObject(type: EntityType, name: string): any {}
  public CreateRecordEnityReceiver(): any {}
}
