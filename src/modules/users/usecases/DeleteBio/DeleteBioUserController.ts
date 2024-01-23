import { Request, Response } from "express";
import { BaseController } from "../../../../core/infrastructure/BaseController";
import { DeleteBioUserUseCase } from "./DeteleBioUserUseCase";
import { UserDto } from "../dto/UserDto";
import { ObjectId } from "mongodb";
import { DeleteBioUserError } from "./DeleteBioUserError";

export class DeleteBioUserController extends BaseController {
  constructor(
    req: Request,
    res: Response,
    private useCase: DeleteBioUserUseCase
  ) {
    super(req, res);
  }
  protected async executeImpl(): Promise<any> {
    try {
      let dto = { id: new ObjectId() };
      if (this.req.params.id) {
        dto.id = new ObjectId(this.req.params.id.toString());
      } else {
        dto.id = new ObjectId(this.req.userId);
      }
      const result = await this.useCase.execute(dto);
      const value = result.value;
      if (result.isLeft()) {
        const err = result.value;
        switch (err.constructor) {
          case DeleteBioUserError.UserNotFound:
            return this.unauthorized(
              err.errorValue().message,
              "AccountNotExist"
            );
          default:
            return this.fail(err.errorValue().messsage);
        }
      }
      return this.ok<void>(this.res);
    } catch (err: any | string) {
      this.fail(err);
    }
  }
}
