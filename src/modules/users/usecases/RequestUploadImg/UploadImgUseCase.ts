import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { ObjectId } from "mongodb";
import CloundinaryService from "../../../../infrastructure/service/Cloundinary";
import { UpLoadImgError } from "./UploadImgError";

type Response = Either<UpLoadImgError.UserNotFound | Result<any>, Result<void>>;

type Dto = {
  id: ObjectId;
};
export class UpLoadImgUseCase implements UseCase<Dto, Promise<Response>> {
  constructor(private userRepo: IUserRepo) {}
  async execute(request: Dto): Promise<Response> {
    const { id } = request;
    const finduser = await this.userRepo.findUserById(id);
    if (!finduser) {
      return left(new UpLoadImgError.UserNotFound());
    }
    const url: string = CloundinaryService.instance.SignImageUploadUrl({
      public_id: "avatar",
      folder: id,
    });
    return right(Result.ok<string>(url)) as Response;
  }
}
