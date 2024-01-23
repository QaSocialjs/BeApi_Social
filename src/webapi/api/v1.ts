import express from "express";
import { useRouter } from "../../modules/users/infra/http/routes";

const v1Route = express.Router();

v1Route.use("/api/v1", useRouter);
export { v1Route };
