import { PRIVATE_KEY } from "../../../../../scripts/env/enviroment";
import { UseCase } from "../../../../core/domain/UseCase";
import { Token } from "../../../../core/infrastructure/Token";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import { LoginEmailVerificationError } from "./LoginEmailVerificationError";
import { UserEmail } from "../../domain/UserEmail";
import { UserPassword } from "../../domain/UserPassword";
import { User } from "../../domain/User";
import UserModel from "../../../../infrastructure/sequelize/models/User";
import { Long, Timestamp } from "mongodb";

type Response = Either<
  | GenericAppError.UnexpectedError
  | LoginEmailVerificationError.IncorrectEmail
  | Result<any>,
  Result<void>
>;

export class LoginEmailVerificationUseCase
  implements UseCase<UserDto, Promise<Response>>
{
  private dto: IUserRepo;
  constructor(dto: IUserRepo) {
    this.dto = dto;
  }
  async execute(request: UserDto): Promise<Response> {
    const { email } = request;
    const emailError = UserEmail.create(email);

    if (emailError.isFailure) {
      return left(Result.fail<void>(emailError.error)) as Response;
    }

    const finduser = await this.dto.findUserByEmail(emailError.getValue());

    if (!finduser) {
      return left(new LoginEmailVerificationError.IncorrectEmail(email));
    }

    const token = new Token(PRIVATE_KEY);
    const accesstoken: string = token.generateToken(finduser._id);
    const refreshtoken: string = token.generateToken(finduser._id);
    const usermodel: UserModel = {
      ...finduser,
      refreshtoken: refreshtoken,
      updatetime: new Date(),
    };
    try {
      await this.dto.update(usermodel);
    } catch (err) {
      return left(new GenericAppError.UnexpectedError(err)) as Response;
    }

    const userDto: UserDto = {
      id: finduser._id,
      accesstoken: accesstoken,
      ...finduser,
      password: "",
    };
    return right(Result.ok<UserDto>(userDto)) as Response;
  }
}
