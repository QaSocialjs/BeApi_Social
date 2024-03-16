import { PRIVATE_KEY } from "../../../scripts/env/enviroment";
import { ResponseApi } from "../../core/infrastructure/Response";
import { Payload, Token } from "../../core/infrastructure/Token";
import { NextFunction, Request, Response } from "express";
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  if (req.headers && req.headers["authorization"]) {
    const token = new Token(PRIVATE_KEY);
    token.verify(
      req.headers["authorization"].split(" ", 2)[1]?.toString(),
      (err, decode) => {
        if (err) {
          ResponseApi.getResponse(res).unauthorized("Unauthorized");
        } else {
          next();
        }
      }
    );
  } else {
    ResponseApi.getResponse(res).unauthorized("Authorization header missing");
  }
}

export function verifyTokenCookie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.cookies && req.cookies["accesstoken"]) {
    const token = new Token(PRIVATE_KEY);
    token.verify(req.cookies["accesstoken"], (err, decode) => {
      if (err) {
        ResponseApi.getResponse(res).unauthorized("Unauthorized");
      } else {
        const decodedToken = decode as Payload;
        req.userId = decodedToken.userId;
        next();
      }
    });
  } else {
    ResponseApi.getResponse(res).unauthorized("Authorization cookie missing");
  }
}

export function verifyAuthentication(req: Request, res: Response) {
  console.log("req");
  console.log(req.headers);
  // if (!req.cookies["accesstoken"]) {
  //   ResponseApi.getResponse(res).ok(res);
  // } else {
  //   ResponseApi.getResponse(res).unauthorized("You are logged in!!!");
  // }
}
