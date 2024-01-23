import { userRepo } from "../../repo";
import { UpdateUserCase } from "./UpdateUserUseCase";

const updateUserUseCase = new UpdateUserCase(userRepo);

export { updateUserUseCase };
