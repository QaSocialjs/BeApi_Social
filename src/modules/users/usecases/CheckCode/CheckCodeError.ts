import { Result } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";

export namespace CheckCodeError {
  export class DontExistUser extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `Your dont register with your mail. Please register and confirm you code`,
      } as UseCaseError);
    }
  }
  export class CodeNotMatch extends Result<UseCaseError> {
    constructor(code: string) {
      super(false, {
        message: `Your code provided: ${code} doesnt match. Please try again`,
      } as UseCaseError);
    }
  }
}
