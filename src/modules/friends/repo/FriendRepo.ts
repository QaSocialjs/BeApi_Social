import { DbClient } from "../../../../scripts/db/dbclient/dbclient";
import {
  FriendShipReq,
  Status,
} from "../../../infrastructure/dbStore/models/Friend";
import { ObjectId } from "mongodb";
import UserModel from "../../../infrastructure/dbStore/models/User";
import { StatusFriend, valueStatusFriend } from "./Status";
import { is } from "shallow-equal-object";
export interface IFriendShipReqRepo {
  // findFriendShipReqByCompany(company: string): Promise<FriendShipReq[] | null>;
  // findFriendShipReqByCompanyRegex(
  //   company: string
  // ): Promise<FriendShipReq[] | null>;
  // SearchFriendShipReqByCompanyAgg(company: string): Promise<Document[] | null>;
  GetAllFriendReq(id: ObjectId): Promise<UserModel[]> | null;
  save(friendShipReq: FriendShipReq): Promise<void>;
  updateStatus(
    id: ObjectId,
    idReq: ObjectId,
    option: {
      status: Status;
    }
  ): Promise<void>;
  checkIsfriend(id: ObjectId, idFr: ObjectId): Promise<string>;
}
export class FriendShipRepo implements IFriendShipReqRepo {
  public async save(friendShipReq: FriendShipReq): Promise<void> {
    await DbClient.instance.collections.friendShipReq.insertOne(friendShipReq);
  }
  public async GetAllFriendReq(id: ObjectId): Promise<UserModel[]> {
    const listReq = await DbClient.instance.collections.friendShipReq
      .aggregate([
        {
          $match: {
            userRetri: id,
            status: {
              code: -1,
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userReq",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $replaceRoot: { newRoot: "$user" },
        },
      ])
      .toArray();
    return listReq as UserModel[];
  }
  public async updateStatus(
    id: ObjectId,
    idReq: ObjectId,
    option: {
      status: Status;
    }
  ): Promise<void> {
    const filter = { userRetri: id, userReq: idReq };
    const options = { $set: option };
    await DbClient.instance.collections.friendShipReq.updateOne(
      filter,
      options
    );
  }
  public async checkIsfriend(id: ObjectId, idFr: ObjectId): Promise<string> {
    const filter = {
      $or: [
        { userReq: id, userRetri: idFr },
        { userReq: idFr, userRetri: id },
      ],
    };
    const isCheck = await DbClient.instance.collections.friendShipReq.findOne(
      filter
    );
    if (isCheck === undefined || isCheck === null)
      return valueStatusFriend[StatusFriend.notFr];

    if (isCheck.status.code === -1) {
      if (id.equals(isCheck.userReq)) {
        return valueStatusFriend[StatusFriend.requestFr];
      }
      return valueStatusFriend[StatusFriend.isRequested];
    }
    return valueStatusFriend[StatusFriend.isFr];
  }
}
