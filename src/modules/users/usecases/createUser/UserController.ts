import { BaseController } from "../../../../core/infrastructure/BaseController";
import { UserDto } from "../dto/UserDto";
import express from "express";
import { CreatedUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

export class UserController extends BaseController {
  private usecase: CreatedUserUseCase;

  constructor(
    req: express.Request,
    res: express.Response,
    usecase: CreatedUserUseCase
  ) {
    super(req, res);
    this.usecase = usecase;
  }
  protected async executeImpl(): Promise<any> {
    const dto: UserDto = this.req.body as UserDto;

    try {
      const result = await this.usecase.execute(dto);
      const value = result.value;
      if (result.isLeft()) {
        const err = result.value;
        switch (err.constructor) {
          case CreateUserError.AccountAlreadyExist:
            return this.conflict(err.errorValue().message);
          default:
            return this.fail(err.errorValue());
        }
      } else {
        return this.ok<any>(this.res, value.getValue());
      }
    } catch (err: any | string) {
      return this.fail(err);
    }
  }
}
