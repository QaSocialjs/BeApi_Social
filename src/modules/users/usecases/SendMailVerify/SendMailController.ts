import { BaseController } from "../../../../core/infrastructure/BaseController";
import { UserDto } from "../dto/UserDto";
import express from "express";
import { SendMailUseCase } from "./SendMailUseCase";
import { SendMailError } from "./SendMailError";

export class SendMailController extends BaseController {
  private usecase: SendMailUseCase;

  constructor(
    req: express.Request,
    res: express.Response,
    usecase: SendMailUseCase
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
        console.log(err);
        switch (err.constructor) {
          case SendMailError.AccountNotExist:
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
