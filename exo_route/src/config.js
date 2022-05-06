import dotenv from "dotenv";
dotenv.config();

const config = {
  db: {
    client: "pg",
    connection: {
      user: process.env.DB_USER,
      database: process.env.DATABASE,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      stub: "./src/db/migration.stub",
    },
  },
  security: {
    secret: "mysecret",
    expiresIn: "2 hours",
  },
};

export default config;
