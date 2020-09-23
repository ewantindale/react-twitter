import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import { createConnection } from "typeorm";
import { Like } from "./entities/Like";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { likeRouter } from "./routes/api/likes";
import { postRouter } from "./routes/api/posts";
import { uploadRouter } from "./routes/api/upload";
import { userRouter } from "./routes/api/users";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import cors from "cors";
import path from "path";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [User, Post, Like],
    migrations: [path.join(__dirname, "./migrations/*")],
    // synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV !== "production",
  });

  await conn.runMigrations();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

  app.use(
    session({
      name: process.env.COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
        logErrors: true,
      }),

      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },

      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: true,
    })
  );

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  app.use("/api/users", userRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/likes", likeRouter);
  app.use("/api/upload", uploadRouter);

  app.listen(process.env.PORT, () =>
    console.log(
      `Express server listening on http://localhost:${process.env.PORT} in ${process.env.NODE_ENV} mode`
    )
  );
};

main().catch((err) => {
  console.error(err);
});
