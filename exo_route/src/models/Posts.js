import { Model } from "objection";
import UserModel from "./Users.js";

class PostModel extends Model {
  static tableName = "posts";

  static relationMappings = {
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: "posts.userId",
        to: "users.id",
      },
    },
  };
}

export default PostModel;
