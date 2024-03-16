import express from "express";
import { getNotificationUseCase } from "../../../usecase/GetNotification";
import { GetNotificationController } from "../../../usecase/GetNotification/GetNotificationController";

const notificationRouter = express.Router();

notificationRouter.get("/getNotification/:id", (req, res) => {
  const getNotification = new GetNotificationController(
    req,
    res,
    getNotificationUseCase
  );
  getNotification.execute(req, res);
});
export { notificationRouter };
