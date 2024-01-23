import { Request, Response, text } from "express";
import { BaseController } from "../../../../core/infrastructure/BaseController";
import { SuggestionCompanyUseCase } from "./SuggestionCompanyUseCase";
import { UserDto } from "../dto/UserDto";
import { ObjectId } from "mongodb";
import { WorkDto } from "../dto/WorkDto";

export class SuggestionCompanyController extends BaseController {
  constructor(
    req: Request,
    res: Response,
    private usecase: SuggestionCompanyUseCase
  ) {
    super(req, res);
  }
  protected async executeImpl(): Promise<any> {
    try {
      let dto = { text: "" };
      dto.text = this.req.query.text as string;
      const result = await this.usecase.execute(dto);
      const value = result.value;
      if (result.isLeft()) {
        const err = result.value;
        switch (err.constructor) {
          default:
            return this.fail(err.errorValue().messsage);
        }
      }
      return this.ok<WorkDto[]>(this.res, value.getValue());
    } catch (err: any | string) {
      this.fail(err);
    }
  }
}
