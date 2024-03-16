import { ObjectId } from "mongodb";
import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { IWorkRepo } from "../../repo/WorkRepo";
import { UpdateWorkUserError } from "./UpdateUserWorkError";
import { Work } from "../../../../infrastructure/dbStore/models/Work";
import _ from "lodash";
type Response = Either<
  | GenericAppError.UnexpectedError
  | UpdateWorkUserError.UserNotFound
  | Result<any>,
  Result<void>
>;
interface Dto {
  id: ObjectId;
  patch: Array<{ op: string; path: string; value: any }>;
}
export class UpdateWorkUserUseCase implements UseCase<Dto, Promise<Response>> {
  private userRepo: IUserRepo;
  private workRepo: IWorkRepo;
  constructor(userRepo: IUserRepo, workRepo: IWorkRepo) {
    this.userRepo = userRepo;
    this.workRepo = workRepo;
  }
  async execute(request: Dto): Promise<Response> {
    const { id, patch } = request;
    const finduser = await this.userRepo.findUserById(id);
    if (!finduser) return left(new UpdateWorkUserError.UserNotFound());
    try {
      for (const operation of patch) {
        const { op, path, value } = operation;
        if (op === "replace") {
          _.set(finduser, path.split("/")[1], value);
        }
      }
      await this.userRepo.update(finduser);
      const work = await this.workRepo.findWorkByCompany(
        finduser.work?.company!
      );
      if (!work) {
        await this.workRepo.save(finduser.work!);
      } else {
        if (
          work.filter((e) => e.position === finduser.work?.position).length ===
          0
        ) {
          await this.workRepo.save(finduser.work!);
        }
      }
    } catch (e) {
      return left(new GenericAppError.UnexpectedError(e));
    }
    return right(Result.ok());
  }
}
