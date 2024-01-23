import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import { UpdateUserError } from "./UpdateUserError";

type Response = Either<
  GenericAppError.UnexpectedError | UpdateUserError.UserNotFound | Result<any>,
  Result<void>
>;
export class UpdateUserCase implements UseCase<UserDto, Promise<Response>> {
  private userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  async execute(request: UserDto): Promise<Response> {
    const a = request;
    try {
      const user = await this.userRepo.findUserById(a.id);
      if (!user) {
        return left(new UpdateUserError.UserNotFound());
      }
      for (const [key, value] of Object.entries(a)) {
        if (
          (user.hasOwnProperty(key) || user[key] === undefined) &&
          key !== "id"
        ) {
          user[key] = value;
        }
      }
      await this.userRepo.update(user);
    } catch (err) {
      return left(new GenericAppError.UnexpectedError(err)) as Response;
    }
    return right(Result.ok<void>()) as Response;
  }
}
