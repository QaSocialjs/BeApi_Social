import { AggregateRoot } from "../../../core/domain/AggragateRoot";
import { UniqueEntityId } from "../../../core/domain/UniqueEntityId";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { UserEmail } from "./UserEmail";
import { UserId } from "./UserId";
import { UserPassword } from "./UserPassword";
import { UserCreateEvent } from "./event/UserCreateEvent";

interface UserProps {
  firstName?: string;
  lastName?: string;
  email: UserEmail;
  password: UserPassword;
  gender?: number;
  age?: string;
}

export class User extends AggregateRoot<UserProps> {
  get id(): UniqueEntityId {
    return this._id;
  }
  get userId(): UserId {
    return UserId.caller(this.id);
  }
  get email(): UserEmail {
    return this.props.email;
  }
  get firstName(): string | undefined {
    return this.props.firstName;
  }

  get lastName(): string | undefined {
    return this.props.lastName;
  }

  get password(): UserPassword {
    return this.props.password;
  }
  get gender(): number | undefined {
    return this.props.gender;
  }
  get age(): string | undefined {
    return this.props.age;
  }
  private constructor(props: UserProps, id?: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityId): Result<User> {
    const filterprops = [
      { argument: props.firstName, argumentName: "firstName" },
      { argument: props.lastName, argumentName: "lastName" },
      { argument: props.age, argumentName: "age" },
      { argument: props.gender, argumentName: "gender" },
      { argument: props.email, argumentName: "email" },
    ].filter((prop) => prop.argument !== undefined);
    const guardResult = Guard.againstNullOrUndefinedBulk(filterprops);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message);
    } else {
      const user = new User({
        ...props,
      });

      const isWasProvided = !!id;
      if (!isWasProvided) {
        user.addDomainEvent(new UserCreateEvent(user));
      }
      return Result.ok<User>(user);
    }
  }
}
