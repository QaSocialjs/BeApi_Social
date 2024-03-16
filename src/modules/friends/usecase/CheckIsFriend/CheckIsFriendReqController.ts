import { BaseController } from "../../../../core/infrastructure/BaseController";
import express from "express";
import { CheckIsFriendReqUseCase } from "./CheckIsFriendReqUseCase";
import { CheckIsReqError } from "./CheckIsFriendReqError";
import { ObjectId } from "mongodb";
import { UserDto } from "../../../users/usecases/dto/UserDto";
import { StatusDto } from "../../repo/Status";

export class CheckIsFriendReqController extends BaseController {
  private usecase: CheckIsFriendReqUseCase;

  constructor(
    req: express.Request,
    res: express.Response,
    usecase: CheckIsFriendReqUseCase
  ) {
    super(req, res);
    this.usecase = usecase;
  }
  protected async executeImpl(): Promise<any> {
    const dto = { id: new ObjectId(), idFr: new ObjectId() };

    try {
      dto.id = new ObjectId(this.req.params.id as string);
      dto.idFr = new ObjectId(this.req.body.idFr as string);
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
        return this.ok<StatusDto>(this.res, value.getValue());
      }
    } catch (err: any | string) {
      return this.fail(err);
    }
  }
}
