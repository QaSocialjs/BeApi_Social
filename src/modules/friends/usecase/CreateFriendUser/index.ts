// import { webServerSocket } from "../../../../infrastructure/http/app";
import { notificationRepo } from "../../../notifications/repo";
import { userRepo } from "../../../users/repo";
import { friendRepo } from "../../repo";
import { CreateFriendReqUseCase } from "./CreateFriendReqUseCase";

const createFriendReqUseCase = new CreateFriendReqUseCase(
  friendRepo,
  userRepo,
  notificationRepo
  // webServerSocket
);

export { createFriendReqUseCase };
