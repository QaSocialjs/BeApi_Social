import { userRepo } from "../../repo";
import { UpLoadImgUseCase } from "./UploadImgUseCase";

const upLoadImgUseCase = new UpLoadImgUseCase(userRepo);

export { upLoadImgUseCase };
