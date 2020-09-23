import { Router } from "express";
import { Like } from "../../entities/Like";

export const likeRouter = Router();

likeRouter.post("/:postId", async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ error: "Unauthorized" });
  }
  const postId = parseInt(req.params.postId);

  const like = await Like.create({
    postId: postId,
    userId: req.session.userId,
  }).save();

  return res.json(like);
});

likeRouter.delete("/:postId", async (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ error: "Unauthorized" });
  }

  const postId = parseInt(req.params.postId);

  const response = await Like.delete({
    postId: postId,
    userId: req.session.userId,
  });

  return res.json(response);
});
