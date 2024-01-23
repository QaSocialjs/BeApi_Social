import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { ObjectId } from "mongodb";
import { PatchUpLoadImgError } from "./PatchUploadImgError";
import { AssetInfo } from "../../../../infrastructure/models/AssetService";
import _ from "lodash";
import { GenericAppError } from "../../../../core/logic/AppError";
type Response = Either<
  PatchUpLoadImgError.UserNotFound | Result<any>,
  Result<void>
>;

type Dto = {
  id: ObjectId;
  patch: Array<{ op: string; path: string; value: any }>;
};
export class PatchUpLoadImgUseCase implements UseCase<Dto, Promise<Response>> {
  constructor(private userRepo: IUserRepo) {}
  async execute(request: Dto): Promise<Response> {
    const { id, patch } = request;
    const finduser = await this.userRepo.findUserById(id);
    if (!finduser) {
      return left(new PatchUpLoadImgError.UserNotFound());
    }
    const avatar: AssetInfo = {} as AssetInfo;

    for (const operation of patch) {
      const { op, path, value } = operation;
      if (op === "replace") {
        _.set(avatar, path.split("/")[2], value);
      }
    }
    finduser.avatar = avatar;
    try {
      await this.userRepo.update(finduser);
    } catch (err) {
      return left(new GenericAppError.UnexpectedError(err)) as Response;
    }

    return right(Result.ok<void>()) as Response;
  }
}
