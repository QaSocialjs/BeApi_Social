import { ObjectId } from "mongodb";
import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IFriendShipReqRepo } from "../../repo/FriendRepo";
import { IUserRepo } from "../../../users/repo/UserRepo";
import { INotificationRepo } from "../../../notifications/repo/NotificationRepo";
import UserModel from "../../../../infrastructure/dbStore/models/User";
import { UserDto } from "../../../users/usecases/dto/UserDto";
import { StatusDto } from "../../repo/Status";
type Response = Either<
  GenericAppError.UnexpectedError | Result<any>,
  Result<void>
>;
interface Dto {
  id: ObjectId;
  idFr: ObjectId;
}
export class CheckIsFriendReqUseCase
  implements UseCase<Dto, Promise<Response>>
{
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
    const { id, idFr } = request;
    let statusCheck = "";
    try {
      statusCheck = await this.friendRepo.checkIsfriend(id, idFr);
    } catch (e) {
      return left(new GenericAppError.UnexpectedError(e));
    }
    return right(Result.ok<StatusDto>({ status: statusCheck })) as Response;
  }
}
