import { Router } from "express";
import { Post } from "../../entities/Post";

export const postRouter = Router();

postRouter.get("/page=:page", async (req, res) => {
  const page = parseInt(req.params.page);

  const resultsPerPage = 10;

  const posts = await Post.find({
    relations: ["author", "likes"],
    order: { createdAt: "DESC" },
    skip: page * resultsPerPage,
    take: resultsPerPage,
  });

  // This might be very inefficient?
  posts.forEach((post: any) => {
    if (post.likes.some((l: any) => l.userId === req.session.userId)) {
      post["likeStatus"] = true;
    }
  });

  return res.json(posts);
});

postRouter.post("/", async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ error: "Unauthorized" });
  }
  const { body } = req.body;

  const newPost = await Post.create({
    body: body,
    authorId: req.session.userId,
  }).save();

  return res.json(newPost);
});

postRouter.delete("/:postId", async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ error: "Unauthorized" });
  }

  const postId = parseInt(req.params.postId);

  const post = await Post.findOne(postId, { relations: ["author"] });

  if (post.author.id !== req.session.userId) {
    return res.status(400).json({ error: "Unauthorized!" });
  }

  const response = await Post.delete(postId);

  return res.json(response);
});
