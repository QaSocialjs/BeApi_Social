import { Entity } from "../../../core/domain/Entity";
import { UniqueEntityId } from "../../../core/domain/UniqueEntityId";

export class UserId extends Entity<any> {
  get id(): UniqueEntityId {
    return this._id;
  }
  constructor(id?: UniqueEntityId) {
    super(null, id);
  }
}
