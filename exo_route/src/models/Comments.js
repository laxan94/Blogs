import { Model } from "objection";
import PostModel from "./Posts.js";
import UserModel from "./Users.js";

class CommentModel extends Model {
  static tableName = "comments";

  static relationMappings = {
    post: {
      relation: Model.BelongsToOneRelation,
      modelClass: PostModel,
      join: {
        from: "comments.postId",
        to: "posts.id",
      },
    },
    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: "comments.userId",
        to: "users.id",
      },
    },
  };
}

export default CommentModel;
