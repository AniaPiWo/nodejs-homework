import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import Joi from "joi";

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
});

const userJoiSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string(),
  token: Joi.string(),
  avatar: Joi.string(),
  verify: Joi.boolean(),
  verificationToken: Joi.string(),
});

userSchema.methods.setPassword = async function (password) {
  this.password = await bcrypt.hash(password, 6);
};

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("user", userSchema, "users");

export { User, userJoiSchema };
