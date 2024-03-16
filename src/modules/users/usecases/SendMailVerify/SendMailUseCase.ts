import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import UserModel from "../../../../infrastructure/dbStore/models/User";
import SendMailService, {
  optionTransport,
} from "../../../../infrastructure/service/SendMailService";
import { IUserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import { SendMailError } from "./SendMailError";
import fs from "fs/promises";
import path from "path";
import cryto from "crypto";

type Response = Either<
  SendMailError.AccountNotExist | Result<any>,
  Result<void>
>;
export class SendMailUseCase implements UseCase<UserDto, Promise<Response>> {
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
    const { email } = request;
    const user = await this.userRepo.findUserByEmail(email);
    if (!user) {
      return left(new SendMailError.AccountNotExist(email)) as Response;
    }
    try {
      const { email } = user!;

      const file = await this.ReadingFile();
      const code = "qa-" + cryto.randomBytes(5).toString("hex");
      SendMailService.useOptions(optionTransport);
      await SendMailService.getInstance().sendMail({
        from: `<${"quocanh"}> <${"anhla12h@gmail.com"}>`,
        to: email,
        subject: "Confirmation Code",
        html: file.replace("{{code}}", code),
      });
      const userUpdate = {
        ...user,
        codeConfirm: code,
      };
      await this.userRepo.update(userUpdate as UserModel);
    } catch (err) {
      return left(new GenericAppError.UnexpectedError(err)) as Response;
    }
    return right(Result.ok<void>()) as Response;
  }
}
