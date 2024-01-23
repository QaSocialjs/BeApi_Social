import * as express from "express";

export abstract class BaseController {
  protected req: express.Request;
  protected res: express.Response;

  constructor(req: express.Request, res: express.Response) {
    this.req = req;
    this.res = res;
  }

  protected abstract executeImpl(): Promise<void | any>;

  public execute(req: express.Request, res: express.Response): void {
    this.req = req;
    this.res = res;
    this.executeImpl();
  }

  public static problemDetailResponse(
    res: express.Response,
    status: number,
    detail: string,
    errors: {
      XErrorType?: string;
      message: string;
    },
    instance?: string
  ) {
    res.status(status).json({
      status,
      detail,
      instance,
      errors,
    });
  }

  public ok<T>(res: express.Response, dto?: T) {
    if (!!dto) {
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  public created() {
    return this.res.sendStatus(201);
  }

  public clientError(message?: string) {
    return BaseController.problemDetailResponse(
      this.res,
      400,
      message ? message : "Client error - Bad request",
      {
        message: message ? message : "Client error - Bad request",
      }
    );
  }

  public unauthorized(message?: string, typeErr?: string) {
    return BaseController.problemDetailResponse(
      this.res,
      401,
      message ? message : "User unauthorized",
      {
        message: message ? message : "User unauthorized",
        XErrorType: typeErr ?? undefined,
      }
    );
  }

  public paymentRequired(message?: string) {
    return BaseController.problemDetailResponse(
      this.res,
      402,
      message ? message : "Payment is required to proceed",
      {
        message: message ? message : "Payment is required to proceed",
      }
    );
  }

  public forbidden(message?: string) {
    return BaseController.problemDetailResponse(
      this.res,
      403,
      message ? message : "Access Forbidden",
      {
        message: message ? message : "Access Forbidden",
      }
    );
  }

  public notFound(message?: string) {
    return BaseController.problemDetailResponse(
      this.res,
      404,
      message ? message : "Requested resource not found",
      {
        message: message ? message : "Requested resource not found",
      }
    );
  }

  public conflict(message?: string) {
    return BaseController.problemDetailResponse(
      this.res,
      409,
      message ? message : "Conflict occurred",
      {
        message: message ? message : "Conflict occurred",
      }
    );
  }

  public tooMany(message?: string) {
    return BaseController.problemDetailResponse(
      this.res,
      429,
      message ? message : "Too many requests received",
      {
        message: message ? message : "Too many requests received",
      }
    );
  }

  public fail(error: Error | string) {
    return BaseController.problemDetailResponse(
      this.res,
      500,
      error instanceof Error ? error.message : error.toString(),
      {
        message: error instanceof Error ? error.message : error.toString(),
      }
    );
  }
}
