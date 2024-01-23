import { Request, Response } from "express";
import { BaseController } from "../../../../core/infrastructure/BaseController";
import { PatchUpLoadImgUseCase } from "./PatchUploadImgUseCase";
import { ObjectId } from "mongodb";
import { PatchUpLoadImgError } from "./PatchUploadImgError";

interface Dto {
  id: ObjectId;
  patch: Array<{ op: string; path: string; value: any }>;
}
export class PatchUploadImgController extends BaseController {
  constructor(
    req: Request,
    res: Response,
    private usecase: PatchUpLoadImgUseCase
  ) {
    super(req, res);
  }
  protected async executeImpl(): Promise<any> {
    const dto: Dto = {
      id: new ObjectId(this.req.body.id),
      patch: this.req.body.patch,
    };

    try {
      const result = await this.usecase.execute(dto);
      const value = result.value;
      if (result.isLeft()) {
        const err = result.value;
        switch (err.constructor) {
          case PatchUpLoadImgError.UserNotFound:
            return this.unauthorized(
              err.errorValue().message,
              "User_Not_Found"
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
