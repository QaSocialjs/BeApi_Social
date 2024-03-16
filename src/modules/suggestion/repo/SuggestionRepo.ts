import { DbClient } from "../../../../scripts/db/dbclient/dbclient";
import UserModel from "../../../infrastructure/dbStore/models/User";
import { ObjectId } from "mongodb";
import { UserEmail } from "../../users/domain/UserEmail";

type EmailInput<T extends string | UserEmail> = T;

export interface ISuggestRepo {
  findUserByEmail<T extends string | UserEmail>(
    email: T
  ): Promise<UserModel | null>;
  findUserById(id: ObjectId): Promise<UserModel | null>;
  findUserBycode(code: string): Promise<UserModel | null>;
  findAll(): Promise<UserModel[] | null>;
  save(user: UserModel): Promise<void>;
  exist(email: UserEmail): Promise<boolean>;
  update(user: UserModel): Promise<void>;
  deleteCode(id: ObjectId): Promise<void>;
  removeFieldSingleRecord(
    id: ObjectId,
    field: string | number | ObjectId | any
  ): Promise<void>;
}

export class SuggestRepo implements ISuggestRepo {
  public async findUserByEmail<T extends string | UserEmail>(
    email: T
  ): Promise<UserModel | null> {
    const value = typeof email === "string" ? email : email.props.value;
    const response = await DbClient.instance.collections.users.findOne({
      email: value,
    });
    if (!!response === true) return response;
    return null;
  }
  public async findUserById(id: ObjectId): Promise<UserModel | null> {
    return await DbClient.instance.collections.users.findOne({ _id: id });
  }

  public async save(user: UserModel): Promise<void> {
    await DbClient.instance.collections.users.insertOne(user);
  }
  public async exist(email: UserEmail): Promise<boolean> {
    const response = await this.findUserByEmail(email);
    return !!response;
  }
  public async update(user: UserModel): Promise<void> {
    const filter = { _id: user._id };
    const options: { $set: UserModel } = { $set: user };
    await DbClient.instance.collections.users.updateOne(filter, options);
  }
  public async findAll(): Promise<UserModel[] | null> {
    return DbClient.instance.collections.users.find().toArray();
  }
  public async findUserBycode(code: string): Promise<UserModel | null> {
    return await DbClient.instance.collections.users.findOne({
      codeConfirm: code,
    });
  }
  public async deleteCode(id: ObjectId): Promise<void> {
    DbClient.instance.collections.users.updateOne(
      {
        _id: id,
      },
      {
        $unset: {
          codeConfirm: "",
        },
      }
    );
  }
  public async removeFieldSingleRecord(
    id: ObjectId,
    field: any
  ): Promise<void> {
    DbClient.instance.collections.users.updateOne(
      {
        _id: id,
      },
      {
        $unset: field,
      }
    );
  }
}
