import { Document, ObjectId } from "mongodb";

export interface FriendShip extends Document {
  userReq: ObjectId;
  userRetri: ObjectId;
  createD: Date;
}

export interface Status {
  code: 1 | -1;
}
export interface FriendShipReq extends FriendShip {
  status: Status;
}
