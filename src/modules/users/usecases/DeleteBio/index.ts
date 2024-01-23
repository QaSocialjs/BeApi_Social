import { userRepo } from "../../repo";
import { DeleteBioUserUseCase } from "./DeteleBioUserUseCase";

const deleteBioUserUsecase = new DeleteBioUserUseCase(userRepo);

export { deleteBioUserUsecase };
