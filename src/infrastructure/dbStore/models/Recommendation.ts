import { Document, ObjectId } from "mongodb";
export interface RecommendationFriend extends Document {
  userId: ObjectId;
  suggestedUserIds: Array<ObjectId>;
}
