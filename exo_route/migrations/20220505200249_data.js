import hashPassword from "../src/middlewares/hashPassword.js";
export const up = async (knex) => {
  const [passwordHash, passwordSalt] = hashPassword("Mypass1234");

  await knex("users").insert([
    {
      email: "admin@test.com",
      name: "kevin",
      passwordHash,
      passwordSalt,
      role_id: 3,
    },
  ]);

  await knex("posts").insert([
    {
      title: "Test",
      content: "ahzdgazhfkdjazjd",
      user_id: 1,
    },
  ]);
};

export const down = async (knex) => {
  await knex("users").where({ id: 1 }).del();

  await knex("posts").where({ id: 1 }).del();
};
