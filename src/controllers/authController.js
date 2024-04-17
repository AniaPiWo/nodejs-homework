import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export async function signup(req, res, next) {
  const { email, password, subscription } = req.body;

  try {
    const user = await User.findOne({ email }, { _id: 1 }).lean();
    if (user) {
      return res.status(409).json({ message: "Email already taken" });
    }

    const newUser = new User({ email, subscription });
    await newUser.setPassword(password);
    await newUser.save();

    res.status(201).json({ message: "User created" });
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