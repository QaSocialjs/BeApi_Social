import { BaseController } from "../../../../core/infrastructure/BaseController";
import express from "express";
import { CreateFriendReqUseCase } from "./CreateFriendReqUseCase";
import { CreateFriendReqError } from "./CreateFriendReqError";
import { ObjectId } from "mongodb";

export class CreateFriendReqController extends BaseController {
  private usecase: CreateFriendReqUseCase;

  constructor(
    req: express.Request,
    res: express.Response,
    usecase: CreateFriendReqUseCase
  ) {
    super(req, res);
    this.usecase = usecase;
  }
  protected async executeImpl(): Promise<any> {
    const dto = { id: new ObjectId(), idFriend: new ObjectId() };

    try {
      dto.id = new ObjectId(this.req.params.id as string);
      dto.idFriend = new ObjectId(this.req.body.idFriend);
      const result = await this.usecase.execute(dto);
      if (result.isLeft()) {
        const err = result.value;
        console.log(err);
        switch (err.constructor) {
          case CreateFriendReqError.UserNotFound:
            return this.unauthorized(
              err.errorValue().message,
              "AccountNotExist"
            );
          case CreateFriendReqError.FailRequest:
            return this.fail(err.errorValue().message);
          default:
            return this.fail(err.errorValue());
        }
      } else {
        return this.ok<any>(this.res);
      }
    } catch (err: any | string) {
      return this.fail(err);
    }
  }
}
