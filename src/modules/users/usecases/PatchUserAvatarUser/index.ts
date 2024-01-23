import { userRepo } from "../../repo";
import { PatchUpLoadImgUseCase } from "./PatchUploadImgUseCase";

const patchupLoadImgUseCase = new PatchUpLoadImgUseCase(userRepo);

export { patchupLoadImgUseCase };
