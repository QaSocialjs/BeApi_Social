import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { ISuggestRepo, SuggestRepo } from "../../repo/SuggestionRepo";
import UserModel from "../../../../infrastructure/dbStore/models/User";
import { UserDto } from "../../../users/usecases/dto/UserDto";

type Response = Either<Result<any>, Result<void>>;

export class SuggestionUserUseCase implements UseCase<null, Promise<Response>> {
  constructor(private suggestRepo: ISuggestRepo) {}
  async execute(): Promise<Response> {
    const finduser = await this.suggestRepo.findAll();

    if (!finduser) {
      return left(
        Result.fail<void>("Cannot get all user in system")
      ) as Response;
    }
    const userDto: UserDto[] = finduser.map((e) => this.convert(e));
    return right(Result.ok<UserDto[]>(userDto)) as Response;
  }
  private convert(dto: UserModel) {
    return {
      id: dto._id,
      ...dto,
    } as UserDto;
  }
}
