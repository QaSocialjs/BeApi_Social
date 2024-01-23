import { Request, Response } from "express";
import { BaseController } from "../../../../core/infrastructure/BaseController";
import { UpLoadImgUseCase } from "./UploadImgUseCase";
import { ObjectId } from "mongodb";
import { UpLoadImgError } from "./UploadImgError";

export class UploadImgController extends BaseController {
  constructor(req: Request, res: Response, private usecase: UpLoadImgUseCase) {
    super(req, res);
  }
  protected async executeImpl(): Promise<any> {
    let dto = { id: new ObjectId() };
    dto.id = new ObjectId(this.req.params.id);
    try {
      const result = await this.usecase.execute(dto);
      const value = result.value;
      if (result.isLeft()) {
        const err = result.value;
        switch (err.constructor) {
          case UpLoadImgError.UserNotFound:
            return this.unauthorized(
              err.errorValue().message,
              "User_Not_Found"
            );
          default:
            return this.fail(err.errorValue().messsage);
        }
      }
      return this.ok<string>(this.res, value.getValue());
    } catch (err: any | string) {
      this.fail(err);
    }
  }
}
