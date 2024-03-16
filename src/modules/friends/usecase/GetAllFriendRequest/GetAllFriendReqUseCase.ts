import { ObjectId } from "mongodb";
import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IFriendShipReqRepo } from "../../repo/FriendRepo";
import { IUserRepo } from "../../../users/repo/UserRepo";
import { INotificationRepo } from "../../../notifications/repo/NotificationRepo";
import UserModel from "../../../../infrastructure/dbStore/models/User";
import { UserDto } from "../../../users/usecases/dto/UserDto";
type Response = Either<
  GenericAppError.UnexpectedError | Result<any>,
  Result<void>
>;
interface Dto {
  id: ObjectId;
}
export class GetAllFriendReqUseCase implements UseCase<Dto, Promise<Response>> {
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
    console.log("asdasidiashdihidasdjd");
    const { id } = request;
    let list: UserModel[];
    try {
      list = (await this.friendRepo.GetAllFriendReq(id)) ?? [];
    } catch (e) {
      return left(new GenericAppError.UnexpectedError(e));
    }
    const userDto: UserDto[] = list.map((e) => this.convert(e));
    return right(Result.ok<UserDto[]>(userDto)) as Response;
  }
  private convert(dto: UserModel) {
    return {
      id: dto._id,
      ...dto,
    } as UserDto;
  }
}
