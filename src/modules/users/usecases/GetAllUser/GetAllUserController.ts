import { Request, Response } from "express";
import { BaseController } from "../../../../core/infrastructure/BaseController";
import { GetAllUserUseCase } from "./GetAllUserUseCase";
import { UserDto } from "../dto/UserDto";
import { ObjectId } from "mongodb";

export class GetAllUserController extends BaseController {
  constructor(
    req: Request,
    res: Response,
    private getAllUserUsecase: GetAllUserUseCase
  ) {
    super(req, res);
  }
  protected async executeImpl(): Promise<any> {
    try {
      const result = await this.getAllUserUsecase.execute();
      const value = result.value;
      if (result.isLeft()) {
        const err = result.value;
        switch (err.constructor) {
          default:
            return this.fail(err.errorValue().messsage);
        }
      }
      return this.ok<UserDto[]>(this.res, value.getValue());
    } catch (err: any | string) {
      this.fail(err);
    }
  }
}
