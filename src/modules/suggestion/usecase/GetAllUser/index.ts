import { suggestRepo } from "../../repo";
import { SuggestionUserUseCase } from "./SuggestionUserUseCase";

const suggestionUser = new SuggestionUserUseCase(suggestRepo);

export { suggestionUser };
