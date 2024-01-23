import { ObjectId } from "mongodb";
import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import UserModel from "../../../../infrastructure/sequelize/models/User";
import { UserEmail } from "../../domain/UserEmail";

type Response = Either<Result<any>, Result<void>>;

type Dto = {
  email: string;
};
export class GetUserEmailUseCase implements UseCase<Dto, Promise<Response>> {
  constructor(private userRepo: IUserRepo) {}
  async execute(request: Dto): Promise<Response> {
    const { email } = request;
    const emailError = UserEmail.create(email);

    if (emailError.isFailure) {
      return left(Result.fail<void>(emailError.error)) as Response;
    }
    let finduser: UserModel | null;
    finduser = await this.userRepo.findUserByEmail(emailError.getValue());

    if (!finduser) {
      return left(Result.fail<void>("User not found")) as Response;
    }
    const userDto: UserDto = {
      id: finduser._id,
      email: finduser.email,
      firstName: finduser.firstName,
      lastName: finduser.lastName,
      age: finduser.age,
      gender: finduser.gender,
      password: "",
      role: finduser.role,
    };
    return right(Result.ok<UserDto>(userDto)) as Response;
  }
}
