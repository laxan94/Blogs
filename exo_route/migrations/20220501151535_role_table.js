export const up = async (knex) => {
  await knex.schema
    .createTable("roles", (table) => {
      table.increments("id");
      table.text("role").notNullable().unique();
    })
    .then(() =>
      knex("roles").insert([
        { role: "reader" },
        { role: "author" },
        { role: "admin" },
      ])
    );

  await knex.schema.table("users", (table) => {
    table.text("name").notNullable();
    table.boolean("is_active");
    table.integer("role_id").defaultTo(1);
    table.foreign("role_id").references("id").inTable("roles");
  });

  await knex.schema.table("posts", (table) => {
    table.text("content").notNullable();
    table.boolean("is_published");
  });
};

export const down = async (knex) => {
  await knex.schema.table("users", (table) => {
    table.dropColumn("name");
    table.dropColumn("is_active");
    table.dropColumn("role_id");
  });
  await knex.schema.table("posts", (table) => {
    table.dropColumn("content");
    table.dropColumn("is_published");
  });
  await knex.schema.dropTable("roles");
};
