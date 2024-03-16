// import { webServerSocket } from "../../../../infrastructure/http/app";
import { notificationRepo } from "../../../notifications/repo";
import { userRepo } from "../../../users/repo";
import { friendRepo } from "../../repo";
import { GetAllFriendReqUseCase } from "./GetAllFriendReqUseCase";

const getAllFriendReqUseCase = new GetAllFriendReqUseCase(
  friendRepo,
  userRepo,
  notificationRepo
);

export { getAllFriendReqUseCase };
