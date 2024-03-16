import { ObjectId } from "mongodb";
import { UserRole } from "../../../../infrastructure/dbStore/models/Role";
import { AssetInfo } from "../../../../infrastructure/models/AssetService";
import { City } from "../../../../infrastructure/dbStore/models/User";
import { Work } from "../../../../infrastructure/dbStore/models/Work";

export interface UserDto {
  id: ObjectId;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  gender: number;
  age: string;
  confirmpassword?: string;
  accesstoken?: string;
  refreshtoken?: string;
  role: UserRole;
  codeConfirm?: string;
  avatar?: AssetInfo;
  city?: City;
  work?: Work;
  startWork?: Date;
  endWork?: Date;
  bio?: string;
  phone?: number;
}
