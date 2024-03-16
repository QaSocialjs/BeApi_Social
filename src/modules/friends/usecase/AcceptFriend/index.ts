import { notificationRepo } from "../../../notifications/repo";
import { userRepo } from "../../../users/repo";
import { friendRepo } from "../../repo";
import { AcceptFriendReqUseCase } from "./AcceptFriendReqUseCase";

const acceptFriendUsecase = new AcceptFriendReqUseCase(
  friendRepo,
  userRepo,
  notificationRepo
);

export { acceptFriendUsecase };
