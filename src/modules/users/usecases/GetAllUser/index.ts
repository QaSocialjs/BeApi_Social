import { userRepo } from "../../repo";
import { GetAllUserUseCase } from "./GetAllUserUseCase";

const getUserAllUsecase = new GetAllUserUseCase(userRepo);

export { getUserAllUsecase };
