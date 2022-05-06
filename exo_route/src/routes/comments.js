import auth from "../middlewares/auth.js";
import CommentModel from "../models/comments.js";
import UsersModel from "../models/users.js";

const commentsRoute = ({ app }) => {
  app.get("/comments/:post_id", async (req, res) => {
    const {
      params: { post_id },
    } = req;

    const comments = await CommentModel.query().where("post_id", post_id);

    if (!comments) {
      res.status(401).send({ error: "bad post id! " });
      return;
    }

    res.send(comments);
  });

  app.post("/comments", auth, async (req, res) => {
    const {
      body: { commentaire, userId, postId },
    } = req;

    try {
      const comment = await CommentModel.query().insertAndFetch({
        commentaire,
        user_id: Number(userId),
        post_id: Number(postId),
      });

      res.send(comment);
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: err.message });
    }
  });

  app.put("/comments/:commentId", auth, async (req, res) => {
    const {
      params: { commentId },
      body: { commentaire, userId },
      session: { userId: sessionUserId },
    } = req;

    try {
      if (userId !== sessionUserId) {
        res.status(401).send({ message: "Session mismatching" });

        return;
      }

      const comment = await CommentModel.query().findById(commentId);

      if (!comment) {
        res.status(404).send({ message: "Comment not found." });

        return;
      }

      const updatedComment = await CommentModel.query().updateAndFetchById(
        commentId,
        { commentaire }
      );

      res.send(updatedComment);
    } catch (message) {
      res.send(message);
    }
  });

  app.delete("/comments/:commentId", auth, async (req, res) => {
    const {
      params: { commentId },
      session: { userId: sessionUserId },
    } = req;

    try {
      const comment = await CommentModel.query().findById(Number(commentId));
      const senderUserRight = await UsersModel.query()
        .select("rights.label as right")
        .join("roles", "roles.id", "users.roleId")
        .findById(sessionUserId);

      if (!comment) {
        res.status(404).send({ message: "Comment not found" });

        return;
      }

      if (
        comment.userId !== sessionUserId &&
        senderUserRight.role !== "admin"
      ) {
        res.status(401).send({ message: "Forbidden" });

        return;
      }

      await CommentModel.query().deleteById(commentId);
      res.status(200).send({ message: "Comment deleted." });
    } catch (message) {
      res.send(message);
    }
  });
};
export default commentsRoute;
