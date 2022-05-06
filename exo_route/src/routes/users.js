import UserModel from "../models/Users.js";
import hashPassword from "../middlewares/hashPassword.js";
import jsonwebtoken from "jsonwebtoken";
import config from "../config.js";
import auth from "../middlewares/auth.js";

const usersRoute = ({ app }) => {
  //login
  app.post("/login", async (req, res) => {
    const {
      body: { email, password },
    } = req;

    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      res.status(401).send("email or password invalid");

      return;
    }

    if (!user.checkPassword(password)) {
      res.status(401).send("bad credentiel");

      return;
    }

    const jwt = jsonwebtoken.sign(
      { payload: { userId: user.id } },
      config.security.secret,
      { expiresIn: config.security.expiresIn }
    );

    res.send({ jwt, sessionUserId: user.id });
  });

  //Register
  app.post("/register", async (req, res) => {
    const {
      body: { email, password, name },
    } = req;

    const [passwordHash, passwordSalt] = hashPassword(password);
    const user = await UserModel.query().insertAndFetch({
      email,
      passwordHash,
      passwordSalt,
      name,
    });
    res.send({ status: "OK" });
  });

  // GET
  app.get("/users", async (req, res) => {
    res.send(await UserModel.query());
  });

  //GET/ID
  app.get("/users/:userId", auth, async (req, res) => {
    const {
      params: { userId },
      session: { userId: sessionUserId },
    } = req;

    if (Number(userId) != sessionUserId) {
      res.status(403).send("access Denied");

      return;
    }
    const user = await UserModel.query().findById(userId);
    res.send(user);
  });
  //PUT
  app.put("/users/:userId", async (req, res) => {
    const {
      params: { userId },
      body: { email, firstName, lastName, password },
    } = req;

    const user = await UserModel.query().findById(userId);

    if (!user) {
      res.status(404).send("User not found");

      return;
    }

    const [passwordHash, passwordSalt] = hashPassword(password);

    await UserModel.query()
      .update({
        email: email,
        firstName: firstName,
        lastName: lastName,
        passwordHash,
        passwordSalt,
      })
      .where("id", userId);
    res.send("User updated n °" + userId);
  });

  // DELETE
  app.delete("/users/:userId", async (req, res) => {
    const {
      params: { userId },
    } = req;

    const findUser = await UserModel.query().findById(userId);

    if (!findUser) {
      res.status(404).send("User not found");

      return;
    }
    await UserModel.query().deleteById(userId);

    res.send("Deleted post " + userId);
  });
};

export default usersRoute;
