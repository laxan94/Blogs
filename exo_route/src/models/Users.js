import { Model } from "objection";
import hashPassword from "../middlewares/hashPassword.js";
import RoleModel from "./Roles.js";

class UserModel extends Model {
  static tableName = "users";

  static relationMappings = {
    role: {
      relation: Model.BelongsToOneRelation,
      modelClass: RoleModel,
      join: {
        from: "users.roleId",
        to: "roles.id",
      },
    },
  };

  checkPassword(password) {
    const [passwordHash] = hashPassword(password, this.passwordSalt);

    return passwordHash === this.passwordHash;
  }

  static findUserByEmail(email) {
    return UserModel.query().findOne({ email });
  }
}

export default UserModel;
