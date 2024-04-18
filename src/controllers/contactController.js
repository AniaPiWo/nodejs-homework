// Controllers are responsible for handling HTTP requests, processing business logic, and rendering responses. In your application

import { Contact } from "../models/contactModel.js";
import Joi from "joi";

export const getAll = async (req, res) => {
  let contacts;
  try {
    contacts = await Contact.find({}).sort({ createdAt: "desc" });

    return res.json({ contacts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* export const getPaginated = async (req, res) => {
  let contacts;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  let startIndex = (page - 1) * limit;
  let endIndex = page * limit;

  try {
    contacts = await Contact.find({}).sort({ createdAt: "desc" });

    const results = {};

    if (endIndex < contacts.length) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.prev = {
        page: page - 1,
        limit: limit,
      };
    }

    results.contacts = contacts.slice(startIndex, endIndex);

    return res.json({ results });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}; */
export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const reqContact = await Contact.findOne({ _id: id });
    if (!reqContact) return res.sendStatus(404);
    return res.json(reqContact);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const favoriteContacts = await Contact.find({ isFavorite: true });
    return res.json(favoriteContacts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    await Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      isFavorite: Joi.boolean(),
    }).validateAsync(req.body);

    const createdContact = await Contact.create({ name, email, phone });

    return res.status(201).json(createdContact);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedContactFields = req.body;

    await Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
      isFavorite: Joi.boolean(),
    }).validateAsync(updatedContactFields);

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id },
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
    const id = req.params.id;
    const deletedContact = await Contact.findOneAndDelete({ _id: id });
    if (!deletedContact) return res.sendStatus(404);
    return res.json(deletedContact);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const favoriteSet = async (req, res) => {
  try {
    const id = req.params.id;
    const { isFavorite } = req.body;

    if (!isFavorite) {
      return res.status(400).json({ message: "Missing field favorite" });
    }

    await Joi.boolean().required().validateAsync(isFavorite);

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id },
      { isFavorite },
      { new: true }
    );
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
