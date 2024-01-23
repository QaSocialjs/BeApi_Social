import { userRepo } from "../../repo";
import { DeleteCityUserUseCase } from "./DeteleCityUserUseCase";

const deleteCityUserUsecase = new DeleteCityUserUseCase(userRepo);

export { deleteCityUserUsecase };
