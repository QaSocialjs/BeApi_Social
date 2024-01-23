import { PRIVATE_KEY } from "../../../../../scripts/env/enviroment";
import { UseCase } from "../../../../core/domain/UseCase";
import { Token } from "../../../../core/infrastructure/Token";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import { LoginError } from "./LoginError";
import { UserEmail } from "../../domain/UserEmail";
import { UserPassword } from "../../domain/UserPassword";
import { User } from "../../domain/User";
import UserModel from "../../../../infrastructure/sequelize/models/User";
import { Long, Timestamp } from "mongodb";

type Response = Either<
  | GenericAppError.UnexpectedError
  | LoginError.InCorrectPassword
  | LoginError.IncorrectEmail
  | LoginError.UnconfirmEmail
  | Result<any>,
  Result<void>
>;

export class LoginUseCase implements UseCase<UserDto, Promise<Response>> {
  private dto: IUserRepo;
  constructor(dto: IUserRepo) {
    this.dto = dto;
  }
  async execute(request: UserDto): Promise<Response> {
    const { email, password } = request;
    const emailError = UserEmail.create(email);

    if (emailError.isFailure) {
      return left(Result.fail<void>(emailError.error)) as Response;
    }

    const passwordError = UserPassword.create({ value: password });
    let userError = User.create({
      email: emailError.getValue(),
      password: passwordError.getValue(),
    });
    const user: User = userError.getValue();
    const finduser = await this.dto.findUserByEmail(emailError.getValue());
    if (!finduser) {
      return left(new LoginError.IncorrectEmail(user.email.props.value));
    }

    const isPassword = await user.password.comparePassword(
      finduser.password,
      true
    );
    if (!isPassword) {
      return left(new LoginError.InCorrectPassword());
    }
    if (finduser?.codeConfirm) {
      return left(new LoginError.UnconfirmEmail());
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
