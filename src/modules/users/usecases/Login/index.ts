import { userRepo } from "../../repo";
import { LoginUseCase } from "./LoginUseCase";

const loginUsecase = new LoginUseCase(userRepo);

export { loginUsecase };
