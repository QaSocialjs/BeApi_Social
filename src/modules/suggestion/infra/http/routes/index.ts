import express from "express";
import { suggestionUser } from "../../../usecase/GetAllUser";
import { SuggestionUserController } from "../../../usecase/GetAllUser/SuggestionUserController";

const suggestionRouter = express.Router();
suggestionRouter.get("/suggestion", (req, res) => {
  const suggestionController = new SuggestionUserController(
    req,
    res,
    suggestionUser
  );
  suggestionController.execute(req, res);
});
export { suggestionRouter };
