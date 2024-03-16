import { extend } from "lodash";
import { Result } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";

export namespace CreateFriendReqError {
  export class UserNotFound extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message: message,
      } as UseCaseError);
    }
  }
  export class FailRequest extends Result<UseCaseError> {
    constructor(message: string) {
      super(false, {
        message: message,
      } as UseCaseError);
    }
  }
}
