import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";

export async function signup(req, res, next) {
  const { email, password, subscription } = req.body;

  try {
    const user = await User.findOne({ email }).lean();
    if (user) {
      return res.status(409).json({ message: "Email already taken" });
    }

    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "identicon",
    });

    const newUser = new User({ email, subscription, avatar });
    await newUser.setPassword(password);
    await newUser.save();

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
