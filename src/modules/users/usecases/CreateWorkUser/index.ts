import { userRepo, workRepo } from "../../repo";
import { CreatedWorkUserUseCase } from "./CreateUserWorkUseCase";

const createWorkUserUseCase = new CreatedWorkUserUseCase(userRepo, workRepo);

export { createWorkUserUseCase };
