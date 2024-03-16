import { BaseController } from "../../../../core/infrastructure/BaseController";
import express from "express";
import { GetAllFriendReqUseCase } from "./GetAllFriendReqUseCase";
import { GetAllFriendReqError } from "./GetAllFriendReqError";
import { ObjectId } from "mongodb";
import { UserDto } from "../../../users/usecases/dto/UserDto";

export class GetAllFriendReqController extends BaseController {
  private usecase: GetAllFriendReqUseCase;

  constructor(
    req: express.Request,
    res: express.Response,
    usecase: GetAllFriendReqUseCase
  ) {
    super(req, res);
    this.usecase = usecase;
  }
  protected async executeImpl(): Promise<any> {
    const dto = { id: new ObjectId() };

    try {
      dto.id = new ObjectId(this.req.params.id as string);
      const result = await this.usecase.execute(dto);
      const value = result.value;
      if (result.isLeft()) {
        const err = result.value;
        console.log(err);
        switch (err.constructor) {
          default:
            return this.fail(err.errorValue());
        }
      } else {
        return this.ok<UserDto[]>(this.res, value.getValue());
      }
    } catch (err: any | string) {
      return this.fail(err);
    }
  }
}
