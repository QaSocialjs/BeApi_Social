import { userRepo } from "../../repo";
import { GetUserUseCase } from "./GetUserUseCase";

const getUserUsecase = new GetUserUseCase(userRepo);

export { getUserUsecase };
