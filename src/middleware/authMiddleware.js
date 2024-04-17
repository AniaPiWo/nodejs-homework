import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const splitToken = token.split(" ")[1];

    const decoded = jwt.verify(splitToken, process.env.SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "No such user" });
    }

    console.log(
      "user.token => ",
      user.token,
      "user =>",
      user,
      "decoded => ",
      decoded,
      "splitToken => ",
      splitToken,
      "token =>",
      token
    );

    if (user.token !== splitToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized", error: error.message });
  }
};

export default authMiddleware;
