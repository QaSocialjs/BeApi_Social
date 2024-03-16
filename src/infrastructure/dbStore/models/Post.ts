import { Document } from "mongodb";
import { User } from "../../../modules/users/domain/User";
export interface PostModel extends Document {
  desc?: string;
}
