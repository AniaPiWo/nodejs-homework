const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

router.get("/", async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

router.get("/:contactId", async (req, res) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.status(200).json(contact);
});

router.post("/", async (req, res) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
});

router.delete("/:contactId", async (req, res) => {
  const contactId = req.params.contactId;
  const contact = await getContactById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  await removeContact(contactId);
  res.status(200).json({ message: "Contact deleted" });
});

router.put("/:contactId", async (req, res) => {
  const contactId = req.params.contactId;
  const body = req.body;

  const { name, email, phone } = body;
  if (!name && !email && !phone) {
    return res.status(400).json({ message: "missing fields" });
  }
  const contact = await getContactById(contactId);
  if (!contact) {
    return res.status(404).json({ message: "Not found" });
  }
  const updatedContact = await updateContact(contactId, body);
  if (!updatedContact) {
    return res.status(404).json({ message: "Update failed" });
  }
  const updatedContactAfterUpdate = await getContactById(contactId);
  res.status(200).json(updatedContactAfterUpdate);
});

module.exports = router;
