import express from "express";
import knex from "knex";
import { Model } from "objection";
import knexfile from "./knexfile.js";
import usersRoute from "./src/routes/users.js";
import postsRoute from "./src/routes/posts.js";
import commentsRoute from "./src/routes/comments.js";
import cors from "cors";

const app = express();
const db = knex(knexfile);
Model.knex(db);

app.use(
  cors({
    origin: process.env.WEB_APP_ORIGIN,
  })
);

app.use(express.json());

usersRoute({ app });
postsRoute({ app });
commentsRoute({ app });

app.listen(3001, () => console.log("Listening on : 3001"));
