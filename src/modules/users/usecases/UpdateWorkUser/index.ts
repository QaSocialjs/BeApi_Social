import { userRepo, workRepo } from "../../repo";
import { UpdateWorkUserUseCase } from "./UpdateUserWorkUseCase";

const updateWorkUserUseCase = new UpdateWorkUserUseCase(userRepo, workRepo);

export { updateWorkUserUseCase };
