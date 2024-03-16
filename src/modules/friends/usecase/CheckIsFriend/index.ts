import { notificationRepo } from "../../../notifications/repo";
import { userRepo } from "../../../users/repo";
import { friendRepo } from "../../repo";
import { CheckIsFriendReqUseCase } from "./CheckIsFriendReqUseCase";

const checkIsFriendReqUseCase = new CheckIsFriendReqUseCase(
  friendRepo,
  userRepo,
  notificationRepo
);

export { checkIsFriendReqUseCase };
