import { ObjectId } from "mongodb";
import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import UserModel from "../../../../infrastructure/dbStore/models/User";
type Response = Either<Result<any>, Result<void>>;

type Dto = {
  id: ObjectId;
};
export class GetUserUseCase implements UseCase<Dto, Promise<Response>> {
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
      return left(Result.fail<void>("User not found")) as Response;
    }
    const userDto: UserDto = {
      ...finduser,
      id: finduser._id,
      password: "",
    };
    return right(Result.ok<UserDto>(userDto)) as Response;
  }
}
