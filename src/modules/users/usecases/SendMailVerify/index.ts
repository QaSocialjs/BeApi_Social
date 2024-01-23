import { userRepo } from "../../repo";
import { SendMailUseCase } from "./SendMailUseCase";

const sendMailUseCase = new SendMailUseCase(userRepo);

export { sendMailUseCase };
