import { Result } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";

export namespace LoginError {
  export class IncorrectEmail extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `Your ${email} not exist. Please try again`,
      } as UseCaseError);
    }
  }
  export class InCorrectPassword extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Password is incorrect. Please try again`,
      } as UseCaseError);
    }
  }
  export class UnconfirmEmail extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: "Please confirm code from your mail!!!",
      } as UseCaseError);
    }
  }
}
