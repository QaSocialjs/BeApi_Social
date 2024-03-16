import { BaseController } from "../../../../core/infrastructure/BaseController";
import express from "express";
import { AcceptFriendReqUseCase } from "./AcceptFriendReqUseCase";
import { AcceptFriendReqError } from "./AcceptFriendReqError";
import { ObjectId } from "mongodb";
import { UserDto } from "../../../users/usecases/dto/UserDto";

export class AcceptFriendReqController extends BaseController {
  private usecase: AcceptFriendReqUseCase;

  constructor(
    req: express.Request,
    res: express.Response,
    usecase: AcceptFriendReqUseCase
  ) {
    super(req, res);
    this.usecase = usecase;
  }
  protected async executeImpl(): Promise<any> {
    const dto = { id: new ObjectId(), idReq: new ObjectId() };

    try {
      dto.id = new ObjectId(this.req.params.id as string);
      dto.idReq = new ObjectId(this.req.body.idReq as string);
      const result = await this.usecase.execute(dto);
      if (result.isLeft()) {
        const err = result.value;
        console.log(err);
        switch (err.constructor) {
          default:
            return this.fail(err.errorValue());
        }
      } else {
        return this.ok(this.res);
      }
    } catch (err: any | string) {
      return this.fail(err);
    }
  }
}
