import { ObjectId } from "mongodb";
import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import UserModel from "../../../../infrastructure/sequelize/models/User";
import { WorkDto } from "../dto/WorkDto";
import { IWorkRepo } from "../../repo/WorkRepo";
import { Work } from "../../../../infrastructure/sequelize/models/Work";
import { GenericAppError } from "../../../../core/logic/AppError";
type Response = Either<Result<any>, Result<void>>;

type Dto = {
  text: string;
};
export class SuggestionCompanyUseCase
  implements UseCase<Dto, Promise<Response>>
{
  constructor(private workRepo: IWorkRepo) {}
  async execute(request: Dto): Promise<Response> {
    const { text } = request;
    let works: Work[];
    try {
      works ??= (await this.workRepo.findWorkByCompanyRegex(text)) || [];
    } catch (e) {
      return left(new GenericAppError.UnexpectedError(e));
    }

    return right(Result.ok<WorkDto[]>(works)) as Response;
  }
}
