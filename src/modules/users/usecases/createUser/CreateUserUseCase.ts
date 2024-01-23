import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { UserRole } from "../../../../infrastructure/sequelize/models/Role";
import UserModel from "../../../../infrastructure/sequelize/models/User";
import SendMailService, {
  optionTransport,
} from "../../../../infrastructure/service/SendMailService";
import { User } from "../../domain/User";
import { UserEmail } from "../../domain/UserEmail";
import { UserPassword } from "../../domain/UserPassword";
import { IUserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import { CreateUserError } from "./CreateUserError";
import fs from "fs/promises";
import path from "path";
import cryto from "crypto";

type Response = Either<
  | GenericAppError.UnexpectedError
  | CreateUserError.AccountAlreadyExist
  | Result<any>,
  Result<void>
>;
export class CreatedUserUseCase implements UseCase<UserDto, Promise<Response>> {
  private userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  public async ReadingFile(): Promise<string> {
    const filePath = path.join(
      __dirname,
      "../../../../core/resource/EmailTemplate/ReceiveCode.html"
    );
    try {
      return fs.readFile(filePath, "utf8");
    } catch (error) {
      throw new Error("Fail to read template file");
    }
  }
  async execute(request: UserDto): Promise<Response> {
    const {
      email,
      password,
      confirmpassword,
      firstName,
      lastName,
      age,
      gender,
      role,
    } = request;

    const emailError = UserEmail.create(email);
    const passwordError = UserPassword.create({ value: password });
    if (password !== confirmpassword) {
      return left(Result.fail<void>("Password doesnt match")) as Response;
    }
    const combineErr = Result.combine([emailError, passwordError]);
    if (combineErr.isFailure) {
      return left(Result.fail<void>(combineErr.error)) as Response;
    }
    let userError = User.create({
      email: emailError.getValue(),
      password: passwordError.getValue(),
      firstName,
      lastName,
      age: age,
      gender,
    });
    if (userError.isFailure) {
      return left(Result.fail<void>(combineErr.error)) as Response;
    }

    const user: User = userError.getValue();
    const userAlreadyExist = await this.userRepo.exist(user.email);

    if (userAlreadyExist) {
      return left(
        new CreateUserError.AccountAlreadyExist(user.email.props.value)
      ) as Response;
    }
    try {
      const { email, firstName, lastName } = user;
      const hashPassword = await user.password.getHasedValue();

      const file = await this.ReadingFile();
      const code = "qa-" + cryto.randomBytes(5).toString("hex");
      SendMailService.useOptions(optionTransport);
      await SendMailService.getInstance().sendMail({
        from: `<${"quocanh"}> <${"anhla12h@gmail.com"}>`,
        to: email.props.value,
        subject: "Confirmation Code",
        html: file.replace("{{code}}", code),
      });
      const usermodel: UserModel = {
        email: email.props.value,
        password: hashPassword,
        firstName: firstName!,
        lastName: lastName!,
        gender,
        age,
        role: role ?? UserRole.USER,
        codeConfirm: code,
        createtime: new Date(),
        updatetime: new Date(),
      };
      await this.userRepo.save(usermodel);
    } catch (err) {
      return left(new GenericAppError.UnexpectedError(err)) as Response;
    }
    const userRes = {
      email: user.email.props.value,
    };
    return right(Result.ok<any>(userRes)) as Response;
  }
}
