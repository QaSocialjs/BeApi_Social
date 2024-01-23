import { BaseController } from "../../../../core/infrastructure/BaseController";
import { UserDto } from "../dto/UserDto";
import express from "express";
import { UpdateUserCase } from "./UpdateUserUseCase";
import { UpdateUserError } from "./UpdateUserError";
import { ObjectId } from "mongodb";

export class UpdateUserController extends BaseController {
  private usecase: UpdateUserCase;

  constructor(
    req: express.Request,
    res: express.Response,
    usecase: UpdateUserCase
  ) {
    super(req, res);
    this.usecase = usecase;
  }
  protected async executeImpl(): Promise<any> {
    const dto: UserDto = this.req.body as UserDto;
    dto.id = new ObjectId(this.req.params.id.toString());

    try {
      const result = await this.usecase.execute(dto);
      if (result.isLeft()) {
        const err = result.value;
        switch (err.constructor) {
          case UpdateUserError.UserNotFound:
            return this.unauthorized(
              err.errorValue().message,
              "AccountNotExist"
            );
          default:
            return this.fail(err.errorValue());
        }
      } else {
        return this.ok<void>(this.res);
      }
    } catch (err: any | string) {
      return this.fail(err);
    }
  }
}
