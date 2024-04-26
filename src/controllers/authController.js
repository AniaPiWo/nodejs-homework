import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { v4 as uuidv4 } from "uuid";
import postmark from "postmark";
import dotenv from "dotenv";

dotenv.config();

const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN;
const client = new postmark.ServerClient(POSTMARK_API_TOKEN);
const SENDER_EMAIL = process.env.SENDER_EMAIL;

export async function signup(req, res, next) {
  const { email, password, subscription } = req.body;

  try {
    const user = await User.findOne({ email }).lean();
    if (user) {
      return res.status(409).json({ message: "Email already taken" });
    }
    const verificationToken = uuidv4();
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "identicon",
    });

    const newUser = new User({
      email,
      subscription,
      avatar,
      verificationToken,
    });
    await newUser.setPassword(password);
    await newUser.save();

    const verificationLink = `http://localhost:3000/auth/verify/${verificationToken}`;

    client.sendEmail({
      From: SENDER_EMAIL,
      To: email,
      Subject: "Verify your account",
      TextBody: `To verify your account, please follow this link: ${verificationLink}`,
    });

    const userResponse = {
      email: newUser.email,
      subscription: newUser.subscription,
      avatar: newUser.avatar,
    };

    res.status(201).json({ message: "User created", user: userResponse });
  } catch (error) {
    next(error);
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "No such user" });
    }
    if (!user.verify) {
      return res.status(401).json({ message: "User not verified" });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const payload = { id: user._id, email: user.email };

      const accessToken = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "12h",
      });

      user.token = accessToken;
      await user.save();

      const userResponse = {
        email: user.email,
        subscription: user.subscription,
      };

      return res.status(200).json({ accessToken, user: userResponse });
    } else {
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    console.log(verificationToken);
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json({ error: "User not Found" });
    }

    user.verificationToken = null;
    user.verify = true;
    await user.save();

    return res.json({ success: true, message: "User verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server Error" });
  }
};

export const resendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!email) {
      return res.status(400).json({ error: "Missing required field email" });
    }
    if (!user) {
      return res.status(404).json({ error: "Mail not Found" });
    }
    if (user.verify) {
      return res
        .status(400)
        .json({ error: "Verification has been done already" });
    }

    const verificationLink = `http://localhost:3000/auth/verify/${user.verificationToken}`;

    client.sendEmail({
      From: SENDER_EMAIL,
      To: email,
      Subject: "Verify your account",
      TextBody: `To verify your account, please follow this link: ${verificationLink}`,
    });
    return res.status(200).json({ error: "Verification email sent" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    return res.status(204).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
