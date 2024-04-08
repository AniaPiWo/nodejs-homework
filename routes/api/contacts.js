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
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the list of contacts." });
  }
});

router.get("/:contactId", async (req, res) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the contact" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while adding a new contact" });
  }
});

router.delete("/:contactId", async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    await removeContact(contactId);
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting the contact" });
  }
});

router.put("/:contactId", async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const body = req.body;

    const { name, email, phone } = body;
    if (!name && !email && !phone) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    const updatedContact = await updateContact(contactId, body);
    if (!updatedContact) {
      return res.status(404).json({ message: "Update failed" });
    }
    const updatedContactAfterUpdate = await getContactById(contactId);
    res.status(200).json(updatedContactAfterUpdate);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the contact" });
  }
});


module.exports = router;
