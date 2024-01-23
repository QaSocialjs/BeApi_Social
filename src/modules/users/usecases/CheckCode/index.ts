import { userRepo } from "../../repo";
import { CheckCodeUseCase } from "./CheckCodeUseCase";

const checkCodeUseCase = new CheckCodeUseCase(userRepo);

export { checkCodeUseCase };
