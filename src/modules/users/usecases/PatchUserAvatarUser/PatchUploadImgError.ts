import { Result } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";

export namespace PatchUpLoadImgError {
  export class UserNotFound extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "User not found",
      } as UseCaseError);
    }
  }
}
