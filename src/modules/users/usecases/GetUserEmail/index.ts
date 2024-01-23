import { userRepo } from "../../repo";
import { GetUserEmailUseCase } from "./GetUserEmailUseCase";

const getUserEmailUsecase = new GetUserEmailUseCase(userRepo);

export { getUserEmailUsecase };
