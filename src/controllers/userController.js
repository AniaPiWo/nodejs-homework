import User from "../models/userModel.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "No user logged" });
    }

    const userResponse = {
      email: user.email,
      subscription: user.subscription,
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
