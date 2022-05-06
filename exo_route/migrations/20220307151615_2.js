export const up = async (knex) => {
  await knex.schema.createTable("posts", (table) => {
    table.increments("id");
    table.text("title").notNullable();
    table.datetime("created_at").defaultTo(knex.fn.now());
    table.integer("user_id").notNullable();
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });

  await knex.schema.createTable("comments", (table) => {
    table.increments("id");
    table.text("commentaire").notNullable();
    table.datetime("created_at").defaultTo(knex.fn.now());
    table.integer("user_id").notNullable();
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.integer("post_id").notNullable();
    table
      .foreign("post_id")
      .references("id")
      .inTable("posts")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable("comments");
  await knex.schema.dropTable("posts");
};
