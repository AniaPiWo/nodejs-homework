// Controllers are responsible for handling HTTP requests, processing business logic, and rendering responses. In your application
import { Contact, contactJoiSchema } from "../models/contactModel.js";
import { User } from "../models/userModel.js";
import Joi from "joi";

export const getAll = async (req, res) => {
  const owner = req.user._id;

  try {
    const { results, previous, current, next } = res.paginatedResults;

    const ownerContacts = results.filter((result) => result.owner == owner);

    return res.json({ results: ownerContacts, previous, current, next });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const owner = req.user._id;
    const id = req.params.id;
    const reqContact = await Contact.findOne({ _id: id, owner });
    if (!reqContact) return res.sendStatus(404);
    return res.json(reqContact);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const owner = req.user._id;
    const favoriteContacts = await Contact.find({ isFavorite: true, owner });
    return res.json(favoriteContacts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createContact = async (req, res) => {
  const owner = req.user._id;

  const { name, email, phone } = req.body;
  try {
    const { error } = contactJoiSchema.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const createdContact = await Contact.create({ name, email, phone, owner });

    return res.status(201).json(createdContact);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateById = async (req, res) => {
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const owner = req.user._id;
    const id = req.params.id;
    const updatedContactFields = req.body;

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner },
      updatedContactFields,
      { new: true }
    );

    return res.json(updatedContact);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
export const deleteById = async (req, res) => {
  try {
    const owner = req.user._id;
    const id = req.params.id;
    const deletedContact = await Contact.findOneAndDelete({ _id: id, owner });
    if (!deletedContact) return res.sendStatus(404);
    return res.json(deletedContact);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const favoriteSet = async (req, res) => {
  try {
    const owner = req.user._id;
    const id = req.params.id;
    const { isFavorite } = req.body;

    if (!isFavorite) {
      return res.status(400).json({ message: "Missing field favorite" });
    }

    await Joi.boolean().required().validateAsync(isFavorite);

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner },
      { isFavorite },
      { new: true }
    );
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
