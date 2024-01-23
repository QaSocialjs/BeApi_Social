import { Result } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";

export namespace LoginEmailVerificationError {
  export class IncorrectEmail extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `Your ${email} not exist. Please try again`,
      } as UseCaseError);
    }
  }
}
