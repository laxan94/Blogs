import UserModel from "../models/Users.js";
import auth from "../middlewares/auth.js";
import PostModel from "../models/Posts.js";
import CommentModel from "../models/Comments.js";

const postsRoute = ({ app }) => {
  //POST
  app.post("/posts", auth, async (req, res) => {
    const {
      body: { title, content, user_id, isPublished },
    } = req;

    try {
      const user = UserModel.query().findOne({ user_id });

      if (!user) {
        res
          .status(401)
          .send({ error: "User not found. please register or login to post." });

        return;
      }

      const post = await PostModel.query().insertAndFetch({
        title,
        content,
        user_id,
        isPublished,
      });

      res.send(post);
    } catch (err) {
      res.status(500).send({ error: "oops." });
    }
  });
  //GET
  app.get("/posts", async (req, res) => {
    try {
      const posts = await PostModel.query();

      if (!posts) {
        res.status(404).send({ message: "Post not found" });

        return;
      }

      res.send(posts);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });

  //GET/ID
  app.get("/posts/:postId", async (req, res) => {
    const {
      params: { postId },
    } = req;

    if (postId === "undefined") {
      return;
    }
    try {
      const post = await PostModel.query()
        .select(
          "posts.id",
          "title",
          "created_at",
          "content",
          "user_id"
          //"user.name as name",
        )
        .join("users", "users.id", "posts.user_id")
        .findById(Number(postId));

      if (!post) {
        res.status(404).send({ message: "Post not found" });

        return;
      }

      res.send(post);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });
  //PUT
  app.put("/posts/:postId", auth, async (req, res) => {
    const {
      params: { postId },
      body: { title, content, userId },
      session: { userId: sessionUserId },
    } = req;

    try {
      const post = await PostModel.query().findById(postId);
      const payload = {};
      const senderUser = await UserModel.query()
        .select("role")
        .join("roles", "roles.id", "users.role_id")
        .findById(sessionUserId);

      if (post.userId !== userId && senderUser.role !== "admin") {
        res.status(400).send({ message: "Forbidden" });

        return;
      }

      payload.userId = post.userId;

      if (title.length) {
        payload.title = title;
      }

      if (content.length) {
        payload.content = content;
      }
      const updatedPost = await PostModel.query().updateAndFetchById(
        postId,
        payload
      );

      res.send(updatedPost);
    } catch (err) {
      res.send(400).send({ message: err.message });
    }
  });

  //DELETE
  app.delete("/posts/:postId", auth, async (req, res) => {
    const {
      params: { postId },
      session: { userId: sessionUserId },
    } = req;

    try {
      const post = await PostModel.query().findById(postId);
      const senderUser = await UserModel.query()
        .select("role")
        .join("roles", "roles.id", "users.roleId")
        .findById(sessionUserId);

      if (!post) {
        res.status(404).send({ message: "Post  not found." });

        return;
      }

      if (post.userId !== sessionUserId && senderUser.role !== "admin") {
        res.status(401).send({ message: "Forbidden" });

        return;
      }

      const deletedPost = await PostModel.query().deleteById(postId);
      res.send({ message: "Post deleted." });
    } catch (message) {
      res.send(message);
    }
  });
};

export default postsRoute;
