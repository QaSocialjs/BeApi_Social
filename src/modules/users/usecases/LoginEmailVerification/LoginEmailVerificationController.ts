import { BaseController } from "../../../../core/infrastructure/BaseController";
import express from "express";
import { UserDto } from "../dto/UserDto";
import { LoginEmailVerificationUseCase } from "./LoginEmailVerificationUseCase";
import { LoginEmailVerificationError } from "./LoginEmailVerificationError";
export class LoginEmailVerificationController extends BaseController {
  private usecase: LoginEmailVerificationUseCase;
  constructor(
    req: express.Request,
    res: express.Response,
    usecase: LoginEmailVerificationUseCase
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
          case LoginEmailVerificationError.IncorrectEmail:
            return this.unauthorized(
              err.errorValue().message,
              "IncorrectEmail"
            );
          default:
            return this.fail(err.errorValue().messsage);
        }
      }
      const { accesstoken, refreshtoken } = value.getValue();
      this.res.cookie("accesstoken", accesstoken, {
        httpOnly: true,
        maxAge: 3600000,
        secure: false,
      });
      this.res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        maxAge: 3600000 * 2,
        secure: false,
      });
      return this.ok<UserDto>(this.res, value.getValue());
    } catch (err: any | string) {
      return this.fail(err);
    }
  }
}
