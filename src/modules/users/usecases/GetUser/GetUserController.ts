import { Request, Response } from "express";
import { BaseController } from "../../../../core/infrastructure/BaseController";
import { GetUserUseCase } from "./GetUserUseCase";
import { UserDto } from "../dto/UserDto";
import { ObjectId } from "mongodb";

export class GetUserController extends BaseController {
  constructor(
    req: Request,
    res: Response,
    private getUserUsecase: GetUserUseCase
  ) {
    super(req, res);
  }
  protected async executeImpl(): Promise<any> {
    try {
      let dto = { id: new ObjectId() };
      if (this.req.params.id) {
        dto.id = new ObjectId(this.req.params.id.toString());
      } else {
        dto.id = new ObjectId(this.req.userId);
      }
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
