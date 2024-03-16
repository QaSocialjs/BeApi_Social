import { ObjectId } from "mongodb";
import { friendRepo } from "../../modules/friends/repo";
import { EntityType } from "../dbStore/models/enum/EntityType";
import { FriendShip } from "../../modules/friends/domain/Friend";
import { UniqueEntityId } from "../../core/domain/UniqueEntityId";
import { notificationRepo } from "../../modules/notifications/repo/index";
import { Socket } from "socket.io";
import UserModel from "../dbStore/models/User";
import { UserDto } from "../../modules/users/usecases/dto/UserDto";
import { userRepo } from "../../modules/users/repo";

function convert(dto: UserModel) {
  return {
    id: dto._id,
    ...dto,
  } as UserDto;
}
export async function HandleSendReq(
  idCur: string,
  idFr: string,
  socket: Socket
) {
  const fShip = new FriendShip(
    { actorId: new ObjectId(idCur), receiverId: new ObjectId(idFr) },
    new UniqueEntityId()
  );
  try {
    await friendRepo.save({
      createD: new Date(),
      status: {
        code: -1,
      },
      userReq: new ObjectId(idCur),
      userRetri: new ObjectId(idFr),
    });
    await notificationRepo.saveNotificationObject(
      fShip.CreateEntityObject(EntityType.FRIEND_SEND_REQ, "friend_req")
    );
    await notificationRepo.saveRecordNotificationSender(
      fShip.CreateRecordEntitySender()
    );
    await notificationRepo.saveRecordNotificationReceiver(
      fShip.CreateRecordEnityReceiver()
    );
    socket.emit("sendReqSuccess", {
      message: "Send friend request successfully",
    });
  } catch (e) {
    socket.emit("sendFriendReqError", {
      message: "Failed to send friend request. Please try again later",
    });
  }
}
export async function HandleGetAllSndReqWithSpecificUser(
  idFr: string,
  users: Record<string, { socketID: string }[]>,
  socket: Socket
) {
  try {
    const userDto = (
      (await friendRepo.GetAllFriendReq(new ObjectId(idFr))) ?? []
    ).map((e) => convert(e));
    console.log(userDto);
    for (const user of users[idFr]) {
      socket.to(user.socketID).emit("re-renderFriendReq", { users: userDto });
    }
  } catch (e) {
    socket.emit("Some thing is wrong");
  }
}

export async function HandleSendNotification(
  idCur: string,
  users: Record<string, { socketID: string }[]>,
  idFr: string,
  socket: Socket
) {
  try {
    const finduser = await userRepo.findUserById(new ObjectId(idCur));
    console.log(idCur);
    console.log(finduser);
    if (!finduser) {
      socket.emit("Some thing is wrong");
    }
    const u = {
      ...finduser,
      id: finduser!._id,
      password: "",
    };
    console.log(u);
    for (const user of users[idFr]) {
      socket.to(user.socketID).emit("NotificationAlert", {
        u: u,
        type: EntityType.FRIEND_SEND_REQ,
      });
    }
  } catch (e) {
    socket.emit("Some thing is wrong");
  }
}
