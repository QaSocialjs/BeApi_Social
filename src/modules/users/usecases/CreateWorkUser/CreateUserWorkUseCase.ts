import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { IWorkRepo } from "../../repo/WorkRepo";
import { UserDto } from "../dto/UserDto";
import { CreateWorkUserError } from "./CreateUserWorkError";
type Response = Either<
  | GenericAppError.UnexpectedError
  | CreateWorkUserError.UserNotFound
  | Result<any>,
  Result<void>
>;
export class CreatedWorkUserUseCase
  implements UseCase<UserDto, Promise<Response>>
{
  private userRepo: IUserRepo;
  private workRepo: IWorkRepo;
  constructor(userRepo: IUserRepo, workRepo: IWorkRepo) {
    this.userRepo = userRepo;
    this.workRepo = workRepo;
  }
  async execute(request: UserDto): Promise<Response> {
    const user = request;
    const finduser = await this.userRepo.findUserById(user.id);
    if (!finduser) return left(new CreateWorkUserError.UserNotFound());
    try {
      if (!finduser.work) {
        finduser.work = user.work;
        finduser.startWork = user.startWork;
        finduser.endWork = user.endWork;
        await this.userRepo.update(finduser);
      }
      const work = await this.workRepo.findWorkByCompany(user.work?.company!);
      if (!work) {
        await this.workRepo.save(user.work!);
      } else {
        if (
          work.filter((e) => e.position === user.work?.position).length === 0
        ) {
          await this.workRepo.save(user.work!);
        }
      }
    } catch (e) {
      return left(new GenericAppError.UnexpectedError(e));
    }
    return right(Result.ok());
  }
}
