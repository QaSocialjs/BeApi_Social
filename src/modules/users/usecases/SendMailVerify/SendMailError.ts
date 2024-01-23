import { Result } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";

export namespace SendMailError {
  export class AccountNotExist extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The email ${email} dont exist. Please register!!!`,
      } as UseCaseError);
    }
  }
}
