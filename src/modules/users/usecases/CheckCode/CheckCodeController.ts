import { BaseController } from "../../../../core/infrastructure/BaseController";
import { UserDto } from "../dto/UserDto";
import express from "express";
import { CheckCodeUseCase } from "./CheckCodeUseCase";
import { CheckCodeError } from "./CheckCodeError";

export class CheckCodeController extends BaseController {
  private usecase: CheckCodeUseCase;

  constructor(
    req: express.Request,
    res: express.Response,
    usecase: CheckCodeUseCase
  ) {
    super(req, res);
    this.usecase = usecase;
  }
  protected async executeImpl(): Promise<any> {
    const dto: UserDto = this.req.body as UserDto;

    try {
      const result = await this.usecase.execute(dto);
      let value = result.value;
      if (result.isLeft()) {
        const err = result.value;
        switch (err.constructor) {
          case CheckCodeError.CodeNotMatch:
            return this.fail(err.errorValue().message);
          case CheckCodeError.DontExistUser:
            return this.unauthorized(err.errorValue().message);
          default:
            return this.fail(err.error);
        }
      } else {
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
      }
    } catch (err: any | string) {
      return this.fail(err);
    }
  }
}
