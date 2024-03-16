import express from "express";
import { useRouter } from "../../modules/users/infra/http/routes";
import { friendRouter } from "../../modules/friends/infra/http/routes";
import { notificationRouter } from "../../modules/notifications/infra/http/routes";
import { suggestionRouter } from "../../modules/suggestion/infra/http/routes";

const v1Route = express.Router();

v1Route.use(useRouter);
v1Route.use(friendRouter);
v1Route.use(notificationRouter);
v1Route.use(suggestionRouter);
export { v1Route };
