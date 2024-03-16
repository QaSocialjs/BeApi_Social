import express from "express";
import { verifyTokenCookie } from "../../../../../infrastructure/http/middleware";
import { CreateFriendReqController } from "../../../usecase/CreateFriendUser/CreateFriendReqController";
import { createFriendReqUseCase } from "../../../usecase/CreateFriendUser";
import { GetAllFriendReqController } from "../../../usecase/GetAllFriendRequest/GetAllFriendReqController";
import { getAllFriendReqUseCase } from "../../../usecase/GetAllFriendRequest";
import { AcceptFriendReqController } from "../../../usecase/AcceptFriend/AcceptFriendReqController";
import { acceptFriendUsecase } from "../../../usecase/AcceptFriend";
import { CheckIsFriendReqController } from "../../../usecase/CheckIsFriend/CheckIsFriendReqController";
import { checkIsFriendReqUseCase } from "../../../usecase/CheckIsFriend";

const friendRouter = express.Router();
friendRouter.post(
  "/createReqFriend/:id",
  verifyTokenCookie,
  (req: express.Request, res: express.Response) => {
    const createReq = new CreateFriendReqController(
      req,
      res,
      createFriendReqUseCase
    );
    createReq.execute(req, res);
  }
);
friendRouter.get(
  "/getFriendRequest/:id",
  verifyTokenCookie,
  (req: express.Request, res: express.Response) => {
    const getAllFriendReq = new GetAllFriendReqController(
      req,
      res,
      getAllFriendReqUseCase
    );
    getAllFriendReq.execute(req, res);
  }
);
friendRouter.put(
  "/acceptFriend/:id",
  verifyTokenCookie,
  (req: express.Request, res: express.Response) => {
    const acceptFriendController = new AcceptFriendReqController(
      req,
      res,
      acceptFriendUsecase
    );
    acceptFriendController.execute(req, res);
  }
);
friendRouter.put(
  "/checkFriend/:id",
  // verifyTokenCookie,
  (req: express.Request, res: express.Response) => {
    const checkIsFriendReqController = new CheckIsFriendReqController(
      req,
      res,
      checkIsFriendReqUseCase
    );
    checkIsFriendReqController.execute(req, res);
  }
);
export { friendRouter };
