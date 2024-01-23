import { Result } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";

export namespace CreateUserError {
  export class AccountAlreadyExist extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The email ${email} associated for this accont already exists`,
      } as UseCaseError);
    }
  }
}
