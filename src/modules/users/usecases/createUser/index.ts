import { userRepo } from "../../repo";
import { CreatedUserUseCase } from "./CreateUserUseCase";

const createUserUseCase = new CreatedUserUseCase(userRepo);

export { createUserUseCase };
