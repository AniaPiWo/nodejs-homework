// Models represent the data structure of your application and provide an interface for communication with the database.

import mongoose, { Schema } from "mongoose";
import Joi from "joi";

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
    unique: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});
export const contactJoiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email(),
  phone: Joi.string(),
  isFavorite: Joi.boolean(),
  dateCreate: Joi.date(),
  //owner: Joi.string(),
});

export const Contact = mongoose.model("Contact", contactSchema);
