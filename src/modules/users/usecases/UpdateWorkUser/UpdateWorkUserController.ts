import { BaseController } from "../../../../core/infrastructure/BaseController";
import { UserDto } from "../dto/UserDto";
import express from "express";
import { UpdateWorkUserUseCase } from "./UpdateUserWorkUseCase";
import { UpdateWorkUserError } from "./UpdateUserWorkError";
import { ObjectId } from "mongodb";
interface Dto {
  id: ObjectId;
  patch: Array<{ op: string; path: string; value: any }>;
}
export class UpdateWorkUserController extends BaseController {
  private usecase: UpdateWorkUserUseCase;

  constructor(
    req: express.Request,
    res: express.Response,
    usecase: UpdateWorkUserUseCase
  ) {
    super(req, res);
    this.usecase = usecase;
  }
  protected async executeImpl(): Promise<any> {
    const dto: Dto = {
      id: new ObjectId(this.req.params.id),
      patch: this.req.body.patch,
    };
    dto.id = new ObjectId(this.req.params.id as string);

    try {
      const result = await this.usecase.execute(dto);
      const value = result.value;
      if (result.isLeft()) {
        const err = result.value;
        console.log(err);
        switch (err.constructor) {
          case UpdateWorkUserError.UserNotFound:
            return this.unauthorized(
              err.errorValue().message,
              "AccountNotExist"
            );
          default:
            return this.fail(err.errorValue());
        }
      } else {
        return this.ok<any>(this.res);
      }
    } catch (err: any | string) {
      return this.fail(err);
    }
  }
}
