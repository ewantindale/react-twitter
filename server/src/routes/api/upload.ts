import { Router } from "express";
import { User } from "../../entities/User";
import { v2 as cloudinary } from "../../utils/cloudinary";

export const uploadRouter = Router();

uploadRouter.post("/", async (req, res) => {
  if (!req.session.userId) {
    res.status(400).json({ error: "Unauthorized" });
  }
  try {
    const fileString = req.body.data;
    const uploadedResponse = await cloudinary.uploader.upload(fileString, {
      upload_preset: "fullstack_social_profile_pictures",
    });

    const user = await User.findOne(req.session.userId);

    user.pictureId = uploadedResponse.public_id;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "something went wrong" });
  }
});
