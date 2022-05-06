import { pbkdf2Sync, randomBytes } from "crypto";

const hashPassword = (password, salt = randomBytes(64).toString("hex")) => [
  pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex"),
  salt,
];

export default hashPassword;
