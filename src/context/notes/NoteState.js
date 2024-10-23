import React, { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "http://localhost:4000";
  const noteInitial = []
  const [notes, setNote] = useState(noteInitial);

  //get all notes

  const getNotes = async () => {
    const response = await fetch(`${host}/api/note/fetchallnote`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
    });
    const json = await response.json();
    setNote(json);
  };

  //add note

  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/note/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')},
      body: JSON.stringify({ title, description, tag }),
    });
    const note =  await response.json();
    setNote(notes.concat(note));
  };

  //delete note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/note/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')      
      },
    });
    const json = response.json();
    console.log(json);
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNote(newNotes)
  };

  // edit note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/note/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);
    let newNotes=JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNotes.length; index++) {
      const note = newNotes[index];
      if (note._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNote(newNotes)
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
