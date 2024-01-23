import { Response } from "express";

export class ResponseApi {
  private res: Response;
  public static _Response?: ResponseApi;

  constructor(res: Response) {
    this.res = res;
  }
  public static getResponse(res: Response) {
    this._Response = new ResponseApi(res);
    return this._Response;
  }

  public static problemDetailResponse(
    res: Response,
    status: number,
    type: string,
    title: string,
    detail: string,
    errors: {
      message: string;
    },
    instance?: string
  ) {
    res.status(status).json({
      type,
      title,
      status,
      detail,
      instance,
      errors,
    });
  }

  public ok<T>(res: Response, dto?: T) {
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
    return ResponseApi.problemDetailResponse(
      this.res,
      400,
      "https://example.com/probs/bad-request",
      "Bad Request",
      message ? message : "Client error - Bad request",
      {
        message: message ? message : "Client error - Bad request",
      }
    );
  }

  public unauthorized(message?: string) {
    return ResponseApi.problemDetailResponse(
      this.res,
      401,
      "https://example.com/probs/unauthorized",
      "Unauthorized",
      message ? message : "User unauthorized",
      {
        message: message ? message : "User unauthorized",
      }
    );
  }

  public paymentRequired(message?: string) {
    return ResponseApi.problemDetailResponse(
      this.res,
      402,
      "https://example.com/probs/payment-required",
      "Payment Required",
      message ? message : "Payment is required to proceed",
      {
        message: message ? message : "Payment is required to proceed",
      }
    );
  }

  public forbidden(message?: string) {
    return ResponseApi.problemDetailResponse(
      this.res,
      403,
      "https://example.com/probs/forbidden",
      "Forbidden",
      message ? message : "Access Forbidden",
      {
        message: message ? message : "Access Forbidden",
      }
    );
  }

  public notFound(message?: string) {
    return ResponseApi.problemDetailResponse(
      this.res,
      404,
      "https://example.com/probs/not-found",
      "Not Found",
      message ? message : "Requested resource not found",
      {
        message: message ? message : "Requested resource not found",
      }
    );
  }

  public conflict(message?: string) {
    return ResponseApi.problemDetailResponse(
      this.res,
      409,
      "https://example.com/probs/conflict",
      "Conflict",
      message ? message : "Conflict occurred",
      {
        message: message ? message : "Conflict occurred",
      }
    );
  }

  public tooMany(message?: string) {
    return ResponseApi.problemDetailResponse(
      this.res,
      429,
      "https://example.com/probs/too-many-requests",
      "Too Many Requests",
      message ? message : "Too many requests received",
      {
        message: message ? message : "Too many requests received",
      }
    );
  }

  public fail(error: Error | string) {
    console.log(error);
    return ResponseApi.problemDetailResponse(
      this.res,
      500,
      "https://example.com/probs/internal-server-error",
      "Internal Server Error",
      error instanceof Error ? error.message : error.toString(),
      {
        message: error instanceof Error ? error.message : error.toString(),
      }
    );
  }
}
