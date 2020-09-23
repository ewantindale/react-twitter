import argon2 from "argon2";
import { Router } from "express";
import { User } from "../../entities/User";

export const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await User.find({ relations: ["likes"] });

  return res.json(users);
});

userRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (password.length < 5) {
    return res.status(400).json({
      error: "Password must be at least 5 characters",
    });
  }

  const hashedPassword = await argon2.hash(password);

  let user;

  try {
    user = await User.create({
      username,
      email,
      password: hashedPassword,
    }).save();
  } catch (err) {
    if (err.code === "23505") {
      if (err.detail.includes("Key (email)")) {
        return res.status(400).json({
          error: "That email address is already in use",
        });
      } else if (err.detail.includes("Key (username)")) {
        return res.status(400).json({
          error: "That username is already in use",
        });
      }
    }

    throw err;
  }

  req.session.userId = user.id;

  return res.json(user);
});

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  let user;
  try {
    user = await User.findOne({ username });

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      throw new Error();
    }
  } catch (err) {
    return res.status(400).json({
      error: "Incorrect username or password",
    });
  }

  req.session.userId = user.id;

  return res.json(user);
});

userRouter.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ error: err });
    res.clearCookie(process.env.COOKIE_NAME);
    return res.json({ message: "Logged out" });
  });
});

userRouter.get("/info", async (req, res) => {
  if (!req.session.userId) {
    return res.json(null);
  }

  const user = await User.findOne(req.session.userId);

  return res.json(user);
});
