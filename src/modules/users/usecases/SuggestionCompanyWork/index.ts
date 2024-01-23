import { workRepo } from "../../repo";
import { SuggestionCompanyUseCase } from "./SuggestionCompanyUseCase";

const suggestionCompanyUseCase = new SuggestionCompanyUseCase(workRepo);

export { suggestionCompanyUseCase };
