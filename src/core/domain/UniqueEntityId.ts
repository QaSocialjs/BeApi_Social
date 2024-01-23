import { ObjectId } from "mongodb";
import { Identifier } from "./Identifier";

export class UniqueEntityId extends Identifier<string | number | ObjectId> {
  constructor(id?: string | number) {
    super(id ? id : new ObjectId());
  }
}
