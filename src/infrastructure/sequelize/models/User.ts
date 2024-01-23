import { Document, Timestamp, IndexSpecification } from "mongodb";
import { UserRole } from "./Role";
import { AssetInfo } from "../../models/AssetService";
import { Work } from "./Work";

export interface City {
  nameCity: string;
  time: Date;
}
export default interface UserModel extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username?: string;
  refreshtoken?: string;
  gender: number;
  age: string;
  createtime: Date;
  updatetime: Date;
  role: UserRole;
  codeConfirm?: string;
  avatar?: AssetInfo;
  city?: City;
  work?: Work;
  startWork?: Date;
  endWork?: Date;
  bio?: string;
}
