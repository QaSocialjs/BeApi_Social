import { ObjectId } from "mongodb";
import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import UserModel, {
  City,
} from "../../../../infrastructure/sequelize/models/User";
import { GenericAppError } from "../../../../core/logic/AppError";
import { DeleteBioUserError } from "./DeleteBioUserError";
type Response = Either<
  | GenericAppError.UnexpectedError
  | DeleteBioUserError.UserNotFound
  | Result<any>,
  Result<void>
>;

type Dto = {
  id: ObjectId;
};
export class DeleteBioUserUseCase implements UseCase<Dto, Promise<Response>> {
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
      return left(new DeleteBioUserError.UserNotFound()) as Response;
    }
    const field = {
      bio: null,
    };
    const updateUser = this.userRepo.removeFieldSingleRecord(
      finduser._id,
      field
    );

    return right(Result.ok<void>()) as Response;
  }
}
