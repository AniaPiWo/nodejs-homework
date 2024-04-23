import User from "../models/userModel.js";
import path from "path";
import { v4 as uuidV4 } from "uuid";
import fs from "fs/promises";
import { storeImageDir } from "../middleware/multer.js";

export const myAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "No user logged" });
    }

    const userResponse = {
      email: user.email,
      subscription: user.subscription,
      avatar: user.avatar,
    };

    return res.status(200).json(userResponse);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const id = req.user._id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validSubscriptions = ["starter", "pro", "business"];
    if (!validSubscriptions.includes(req.body.subscription)) {
      return res.status(400).json({ message: "No subscription" });
    }

    user.subscription = req.body.subscription;
    await user.save();

    const userResponse = {
      email: user.email,
      subscription: user.subscription,
    };

    return res
      .status(200)
      .json({ message: "Subscription updated", userResponse });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File not provided" });
    }

    const { path: temporaryPath, filename: originalFilename } = req.file;
    const extension = path.extname(originalFilename);
    extension;
    const fileName = `${uuidV4()}${extension}`;
    const filePath = path.join(storeImageDir, fileName);

    await fs.rename(temporaryPath, filePath);

    return res.status(200).json({ message: "Avatar updated" });
  } catch (error) {
    console.error(error);

    if (req.file) {
      await fs.unlink(req.file.path);
    }

    return res.status(500).json({ message: error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const id = req.user._id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (req.file) {
      const { path: temporaryPath, filename: originalFilename } = req.file;
      const extension = path.extname(originalFilename);
      const fileName = `${uuidV4()}${extension}`;
      const filePath = path.join(storeImageDir, fileName);

      await fs.rename(temporaryPath, filePath);

      user.avatar = filePath;
    }
    await user.save();

    return res.status(200).json({ message: "Avatar updated", user });
  } catch (error) {
    console.error("Error updating avatar:", error);
    return res.status(500).json({ message: error.message });
  }
};
