import { UseCase } from "../../../../core/domain/UseCase";
import { Either, Result, left, right } from "../../../../core/logic/Result";
import { IUserRepo, UserRepo } from "../../repo/UserRepo";
import { UserDto } from "../dto/UserDto";
import UserModel from "../../../../infrastructure/sequelize/models/User";

type Response = Either<Result<any>, Result<void>>;

export class GetAllUserUseCase implements UseCase<null, Promise<Response>> {
  constructor(private userRepo: IUserRepo) {}
  async execute(): Promise<Response> {
    const finduser = await this.userRepo.findAll();

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
