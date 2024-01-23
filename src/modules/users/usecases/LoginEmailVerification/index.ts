import { userRepo } from "../../repo";
import { LoginEmailVerificationUseCase } from "./LoginEmailVerificationUseCase";

const loginEmailVerificationUsecase = new LoginEmailVerificationUseCase(
  userRepo
);

export { loginEmailVerificationUsecase };
