import { BaseController } from "../../../../core/infrastructure/BaseController";
import { UserDto } from "../dto/UserDto";
import express from "express";
import { CreatedWorkUserUseCase } from "./CreateUserWorkUseCase";
import { CreateWorkUserError } from "./CreateUserWorkError";
import { ObjectId } from "mongodb";

export class CreateWorkUserController extends BaseController {
  private usecase: CreatedWorkUserUseCase;

  constructor(
    req: express.Request,
    res: express.Response,
    usecase: CreatedWorkUserUseCase
  ) {
    super(req, res);
    this.usecase = usecase;
  }
  protected async executeImpl(): Promise<any> {
    const dto: UserDto = this.req.body as UserDto;
    dto.id = new ObjectId(this.req.params.id as string);

    try {
      const result = await this.usecase.execute(dto);
      const value = result.value;
      if (result.isLeft()) {
        const err = result.value;
        console.log(err);
        switch (err.constructor) {
          case CreateWorkUserError.UserNotFound:
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
