import express from "express";
import { UserController } from "../../../usecases/createUser/UserController";
import { createUserUseCase } from "../../../usecases/createUser";
import { LoginController } from "../../../usecases/Login/LoginController";
import { loginUsecase } from "../../../usecases/Login";
import {
  verifyAuthentication,
  verifyTokenCookie,
} from "../../../../../infrastructure/http/middleware";
import { GetUserController } from "../../../usecases/GetUser/GetUserController";
import { getUserUsecase } from "../../../usecases/GetUser";
import { GetUserEmailController } from "../../../usecases/GetUserEmail/GetUserEmailController";
import { getUserEmailUsecase } from "../../../usecases/GetUserEmail";
import { GetAllUserController } from "../../../usecases/GetAllUser/GetAllUserController";
import { getUserAllUsecase } from "../../../usecases/GetAllUser";
import { CheckCodeController } from "../../../usecases/CheckCode/CheckCodeController";
import { checkCodeUseCase } from "../../../usecases/CheckCode";
import { UploadImgController } from "../../../usecases/RequestUploadImg/UploadImgController";
import { upLoadImgUseCase } from "../../../usecases/RequestUploadImg";
import { SendMailController } from "../../../usecases/SendMailVerify/SendMailController";
import { sendMailUseCase } from "../../../usecases/SendMailVerify";
import { LoginEmailVerificationController } from "../../../usecases/LoginEmailVerification/LoginEmailVerificationController";
import { loginEmailVerificationUsecase } from "../../../usecases/LoginEmailVerification";
import { PatchUploadImgController } from "../../../usecases/PatchUserAvatarUser/PatchUploadImgController";
import { patchupLoadImgUseCase } from "../../../usecases/PatchUserAvatarUser";
import { userRepo } from "../../../repo";
import { UpdateUserController } from "../../../usecases/UpdateUser/UpdateUserController";
import { updateUserUseCase } from "../../../usecases/UpdateUser";
import { DeleteCityUserController } from "../../../usecases/deleteCity/DeleteCityUserController";
import { deleteCityUserUsecase } from "../../../usecases/deleteCity";
import { CreateWorkUserController } from "../../../usecases/CreateWorkUser/CreateWorkUserController";
import { createWorkUserUseCase } from "../../../usecases/CreateWorkUser";
import { UpdateWorkUserController } from "../../../usecases/UpdateWorkUser/UpdateWorkUserController";
import { updateWorkUserUseCase } from "../../../usecases/UpdateWorkUser";
import { SuggestionCompanyController } from "../../../usecases/SuggestionCompanyWork/SuggestionCompanyController";
import { suggestionCompanyUseCase } from "../../../usecases/SuggestionCompanyWork";
import { DeleteBioUserController } from "../../../usecases/DeleteBio/DeleteBioUserController";
import { deleteBioUserUsecase } from "../../../usecases/DeleteBio";

const useRouter = express.Router();

useRouter.post("/signup", (req, res) => {
  const userController = new UserController(req, res, createUserUseCase);
  userController.execute(req, res);
});
useRouter.post("/login", (req, res) => {
  const loginController = new LoginController(req, res, loginUsecase);
  loginController.execute(req, res);
});
useRouter.post("/login/emailVerification", (req, res) => {
  const loginController = new LoginEmailVerificationController(
    req,
    res,
    loginEmailVerificationUsecase
  );
  loginController.execute(req, res);
});
useRouter.post("/verifyAuthentication", verifyAuthentication);
useRouter.post("/sendMailVerify", (req, res) => {
  const sendMail = new SendMailController(req, res, sendMailUseCase);
  sendMail.execute(req, res);
});
useRouter.post("/createUserWork/:id", (req, res) => {
  const createUserWork = new CreateWorkUserController(
    req,
    res,
    createWorkUserUseCase
  );
  createUserWork.execute(req, res);
});
useRouter.post("/upload/:id/avatar", verifyTokenCookie, (req, res) => {
  const uploadImg = new UploadImgController(req, res, upLoadImgUseCase);
  uploadImg.execute(req, res);
});
useRouter.get("/getuser", verifyTokenCookie, (req, res) => {
  const getUserController = new GetUserController(req, res, getUserUsecase);
  getUserController.execute(req, res);
});
useRouter.get("/getuser/:id", verifyTokenCookie, (req, res) => {
  const getUserController = new GetUserController(req, res, getUserUsecase);
  getUserController.execute(req, res);
});
useRouter.get("/getEmailUser", (req, res) => {
  const getUserEmailController = new GetUserEmailController(
    req,
    res,
    getUserEmailUsecase
  );
  getUserEmailController.execute(req, res);
});
useRouter.get("/getAllUser", (req, res) => {
  const getAllUser = new GetAllUserController(req, res, getUserAllUsecase);
  getAllUser.execute(req, res);
});
useRouter.get("/suggestionCompany", (req, res) => {
  const suggestion = new SuggestionCompanyController(
    req,
    res,
    suggestionCompanyUseCase
  );
  suggestion.execute(req, res);
});
useRouter.put("/checkcode", (req, res) => {
  const checkCode = new CheckCodeController(req, res, checkCodeUseCase);
  checkCode.execute(req, res);
});
useRouter.put("/updateUser/:id", verifyTokenCookie, (req, res) => {
  const updateUser = new UpdateUserController(req, res, updateUserUseCase);
  updateUser.execute(req, res);
});
useRouter.patch("/updateUserWork/:id", (req, res) => {
  const updateUserWork = new UpdateWorkUserController(
    req,
    res,
    updateWorkUserUseCase
  );
  updateUserWork.execute(req, res);
});

useRouter.patch("/patchAvatarUser", verifyTokenCookie, (req, res) => {
  const patchuploadImg = new PatchUploadImgController(
    req,
    res,
    patchupLoadImgUseCase
  );
  patchuploadImg.execute(req, res);
});

useRouter.delete("/deleteCity/:id", verifyTokenCookie, (req, res) => {
  const deleteCity = new DeleteCityUserController(
    req,
    res,
    deleteCityUserUsecase
  );
  deleteCity.execute(req, res);
});
useRouter.delete("/deleteBio/:id", verifyTokenCookie, (req, res) => {
  const deleteBio = new DeleteBioUserController(req, res, deleteBioUserUsecase);
  deleteBio.execute(req, res);
});

export { useRouter };
