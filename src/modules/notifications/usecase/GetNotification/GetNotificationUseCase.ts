import { ObjectId } from "mongodb";
import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../../users/repo/UserRepo";
import { UniqueEntityId } from "../../../../core/domain/UniqueEntityId";
import { EntityType } from "../../../../infrastructure/dbStore/models/enum/EntityType";
import { INotificationRepo } from "../../repo/NotificationRepo";
import { RecordNotificationReceiver } from "../../../../infrastructure/dbStore/models/Notification";
import { RecordNotificationReceiverDto } from "../../dto/notificationDto";
type Response = Either<
  GenericAppError.UnexpectedError | Result<any>,
  Result<void>
>;
interface Dto {
  id: ObjectId;
}
export class GetNotificationUseCase implements UseCase<Dto, Promise<Response>> {
  private notifiationRepo: INotificationRepo;
  constructor(notifiationRepo: INotificationRepo) {
    this.notifiationRepo = notifiationRepo;
  }
  async execute(request: Dto): Promise<Response> {
    const { id } = request;
    let listNoti: RecordNotificationReceiver[];
    try {
      listNoti ??=
        (await this.notifiationRepo.findNotificationIdReceiver(id)) || [];
      console.log(listNoti);
    } catch (e) {
      return left(new GenericAppError.UnexpectedError(e));
    }
    return right(
      Result.ok<RecordNotificationReceiverDto[]>(listNoti)
    ) as Response;
  }
}
