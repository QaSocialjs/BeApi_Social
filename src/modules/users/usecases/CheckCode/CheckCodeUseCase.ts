import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import { Token } from "../../../../core/infrastructure/Token";
import { PRIVATE_KEY } from "../../../../../scripts/env/enviroment";
import { CheckCodeError } from "./CheckCodeError";

type Response = Either<
  | CheckCodeError.CodeNotMatch
  | CheckCodeError.DontExistUser
  | GenericAppError.UnexpectedError
  | Result<any>,
  Result<void>
>;
export class CheckCodeUseCase implements UseCase<UserDto, Promise<Response>> {
  private userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  async execute(request: UserDto): Promise<Response> {
    const { codeConfirm, email } = request;
    const userAlreadyExist = await this.userRepo.findUserByEmail(email);
    if (!userAlreadyExist) {
      return left(new CheckCodeError.DontExistUser()) as Response;
    }
    if (codeConfirm !== userAlreadyExist.codeConfirm?.toString()) {
      return left(
        new CheckCodeError.CodeNotMatch(codeConfirm as string)
      ) as Response;
    }
    let userDto: UserDto;
    try {
      const token = new Token(PRIVATE_KEY);
      const accesstoken: string = token.generateToken(userAlreadyExist._id);
      const refreshtoken: string = token.generateToken(userAlreadyExist._id);
      await this.userRepo.deleteCode(userAlreadyExist._id);
      userDto = {
        id: userAlreadyExist._id,
        codeConfirm: "",
        ...userAlreadyExist,
        accesstoken,
        refreshtoken,
        password: "",
      };
    } catch (err) {
      return left(new GenericAppError.UnexpectedError(err)) as Response;
    }
    return right(Result.ok<UserDto>(userDto)) as Response;
  }
}
