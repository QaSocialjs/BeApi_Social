import { ObjectId } from "mongodb";
import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import UserModel, {
  City,
} from "../../../../infrastructure/sequelize/models/User";
import { GenericAppError } from "../../../../core/logic/AppError";
import { DeleteCityUserError } from "./DeleteCityUserError";
type Response = Either<
  | GenericAppError.UnexpectedError
  | DeleteCityUserError.UserNotFound
  | Result<any>,
  Result<void>
>;

type Dto = {
  id: ObjectId;
};
export class DeleteCityUserUseCase implements UseCase<Dto, Promise<Response>> {
  constructor(private userRepo: IUserRepo) {}
  async execute(request: Dto): Promise<Response> {
    const { id } = request;
    if (!id) {
      return left(
        Result.fail<void>("Cannot get property of this user.")
      ) as Response;
    }
    let finduser: UserModel | null;
    finduser = await this.userRepo.findUserById(new ObjectId(id));

    if (!finduser) {
      return left(new DeleteCityUserError.UserNotFound()) as Response;
    }
    const field = {
      city: {
        nameCity: null,
        time: null,
      },
    };
    const updateUser = this.userRepo.removeFieldSingleRecord(
      finduser._id,
      field
    );

    return right(Result.ok<void>()) as Response;
  }
}
