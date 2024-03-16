import { BaseController } from "../../../../core/infrastructure/BaseController";
import express from "express";
import { GetNotificationUseCase } from "./GetNotificationUseCase";
import { GetNotificationError } from "./GetNotificationError";
import { ObjectId } from "mongodb";
import { RecordNotificationReceiverDto } from "../../dto/notificationDto";
import { values } from "lodash";

export class GetNotificationController extends BaseController {
  private usecase: GetNotificationUseCase;

  constructor(
    req: express.Request,
    res: express.Response,
    usecase: GetNotificationUseCase
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
        switch (err.constructor) {
          default:
            return this.fail(err.errorValue());
        }
      } else {
        return this.ok<RecordNotificationReceiverDto[]>(
          this.res,
          value.getValue()
        );
      }
    } catch (err: any | string) {
      return this.fail(err);
    }
  }
}
