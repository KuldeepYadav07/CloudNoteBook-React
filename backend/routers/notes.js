const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE -1// add notes using post . /api/note/addnote : login reqired

router.post(
  "/addnote",
  [
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("description", "description must be atleast 5 cherectors").isLength({
      min: 5,
    }),
  ],
  fetchuser,
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some went wrong. please check server");
    }
  }
);

//ROUTE -2// get all notes using GET . /api/note/fetchallnote : login reqired

router.get("/fetchallnote", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some went wrong. please check server");
  }
});

//ROUTE -3// update notes using put . /api/note/updatenote : login reqired

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // create new object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    let note = await Note.findById(req.params.id);
    //check not is present or not
    if (!note) {
      return res.status(401).send("Not found.!");
    }
    // check both user are same or not
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed.!");
    }
    //update note . if new then add in notes
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some went wrong. please check server");
  }
});

//ROUTE -4// delete notes using DELETE . /api/note/deletenote : login reqired

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    //check not is present or not
    if (!note) {
      return res.status(401).send("Not found.!");
    }
    // check both user are same or not
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed.!");
    }
    //update note . if new then add in notes
    note = await Note.findByIdAndDelete(req.params.id);
    res.send(" Note deleted seccussfully ");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("some went wrong. please check server");
  }
});

module.exports = router;
