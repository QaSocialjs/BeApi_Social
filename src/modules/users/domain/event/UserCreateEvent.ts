import { UniqueEntityId } from "../../../../core/domain/UniqueEntityId";
import { IDomainEvent } from "../../../../core/domain/event/IDomainEvent";
import { User } from "../User";

export class UserCreateEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public user: User;
  constructor(user: User) {
    this.dateTimeOccurred = new Date();
    this.user = user;
  }
  getAggregateId(): UniqueEntityId {
    return this.user.id;
  }
}
