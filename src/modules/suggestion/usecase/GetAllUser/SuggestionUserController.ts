import { Request, Response } from "express";
import { BaseController } from "../../../../core/infrastructure/BaseController";
import { SuggestionUserUseCase } from "./SuggestionUserUseCase";
import { ObjectId } from "mongodb";
import { UserDto } from "../../../users/usecases/dto/UserDto";

export class SuggestionUserController extends BaseController {
  constructor(
    req: Request,
    res: Response,
    private useCase: SuggestionUserUseCase
  ) {
    super(req, res);
  }
  protected async executeImpl(): Promise<any> {
    try {
      const result = await this.useCase.execute();
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
