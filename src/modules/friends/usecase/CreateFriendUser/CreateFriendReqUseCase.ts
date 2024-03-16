import { ObjectId } from "mongodb";
import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { CreateFriendReqError } from "./CreateFriendReqError";
import { IFriendShipReqRepo } from "../../repo/FriendRepo";
import { IUserRepo } from "../../../users/repo/UserRepo";
import { FriendShip } from "../../domain/Friend";
import { UniqueEntityId } from "../../../../core/domain/UniqueEntityId";
import { EntityType } from "../../../../infrastructure/dbStore/models/enum/EntityType";
import { INotificationRepo } from "../../../notifications/repo/NotificationRepo";
type Response = Either<
  | GenericAppError.UnexpectedError
  | CreateFriendReqError.FailRequest
  | CreateFriendReqError.UserNotFound
  | Result<any>,
  Result<void>
>;
interface Dto {
  id: ObjectId;
  idFriend: ObjectId;
}
export class CreateFriendReqUseCase implements UseCase<Dto, Promise<Response>> {
  private friendRepo: IFriendShipReqRepo;
  private userRepo: IUserRepo;
  private notifiationRepo: INotificationRepo;
  constructor(
    friendRepo: IFriendShipReqRepo,
    userRepo: IUserRepo,
    notifiationRepo: INotificationRepo
  ) {
    this.userRepo = userRepo;
    this.friendRepo = friendRepo;
    this.notifiationRepo = notifiationRepo;
  }
  async execute(request: Dto): Promise<Response> {
    const { id, idFriend } = request;
    try {
      // console.log(this.webSocketService);
      // this.webSocketService.emit("friendA", { asd: "sdsad" });
    } catch (e) {
      return left(new GenericAppError.UnexpectedError(e));
    }
    // const fShip = new FriendShip(
    //   { actorId: id, receiverId: idFriend },
    //   new UniqueEntityId()
    // );
    // const curUser = await this.userRepo.findUserById(id);
    // if (!curUser) {
    //   return left(
    //     new CreateFriendReqError.UserNotFound("User not found!!! Please login")
    //   );
    // }
    // const userFr = await this.userRepo.findUserById(idFriend);
    // if (!userFr) {
    //   return left(new CreateFriendReqError.UserNotFound("User dont exist!!!"));
    // }

    // try {
    //   await this.friendRepo.save({
    //     createD: new Date(),
    //     status: {
    //       code: -1,
    //     },
    //     userReq: curUser._id,
    //     userRetri: userFr._id,
    //   });
    //   await this.notifiationRepo.saveNotificationObject(
    //     fShip.CreateEntityObject(EntityType.FRIEND_SEND_REQ, "friend_req")
    //   );
    //   await this.notifiationRepo.saveRecordNotificationSender(
    //     fShip.CreateRecordEntitySender()
    //   );
    //   await this.notifiationRepo.saveRecordNotificationReceiver(
    //     fShip.CreateRecordEnityReceiver()
    //   );
    // } catch (e) {
    //   return left(
    //     new CreateFriendReqError.FailRequest("Sorry try send Friend Again!!!")
    //   );
    // }
    return right(Result.ok());
  }
}
