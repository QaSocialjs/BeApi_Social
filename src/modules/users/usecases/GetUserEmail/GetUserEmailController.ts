import { Request, Response } from "express";
import { BaseController } from "../../../../core/infrastructure/BaseController";
import { GetUserEmailUseCase } from "./GetUserEmailUseCase";
import { UserDto } from "../dto/UserDto";

export class GetUserEmailController extends BaseController {
  constructor(
    req: Request,
    res: Response,
    private getUserUsecase: GetUserEmailUseCase
  ) {
    super(req, res);
  }
  protected async executeImpl(): Promise<any> {
    let dto = { email: "" };
    dto.email = this.req.query.email!.toString();

    try {
      const result = await this.getUserUsecase.execute(dto);
      const value = result.value;
      if (result.isLeft()) {
        const err = result.value;
        switch (err.constructor) {
          default:
            return this.fail(err.errorValue().messsage);
        }
      }
      return this.ok<UserDto>(this.res, value.getValue());
    } catch (err: any | string) {
      this.fail(err);
    }
  }
}
