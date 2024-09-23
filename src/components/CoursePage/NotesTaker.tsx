import React, { useState, useEffect } from "react";
import styles from "./NotesTaker.module.css";

interface NotesTakerProps {
  lessonId: string;
}

interface Note {
  id: string;
  content: string;
  timestamp: number;
}

const NotesTaker: React.FC<NotesTakerProps> = ({ lessonId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    // Load notes from local storage when component mounts
    const savedNotes = localStorage.getItem(`notes-${lessonId}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [lessonId]);

  useEffect(() => {
    // Save notes to local storage whenever they change
    localStorage.setItem(`notes-${lessonId}`, JSON.stringify(notes));
  }, [notes, lessonId]);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const newNoteObj: Note = {
        id: Date.now().toString(),
        content: newNote.trim(),
        timestamp: Date.now(),
      };
      setNotes([...notes, newNoteObj]);
      setNewNote("");
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleEditNote = (id: string, newContent: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, content: newContent } : note
      )
    );
  };

  return (
    <div className={styles.notesTaker}>
      <h3>הערות</h3>
      <div className={styles.addNote}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="הוסף הערה חדשה..."
        />
        <button onClick={handleAddNote}>הוסף הערה</button>
      </div>
      <div className={styles.notesList}>
        {notes.map((note) => (
          <div key={note.id} className={styles.note}>
            <p>{note.content}</p>
            <div className={styles.noteActions}>
              <button
                onClick={() =>
                  handleEditNote(
                    note.id,
                    prompt("ערוך הערה:", note.content) || note.content
                  )
                }
              >
                ערוך
              </button>
              <button onClick={() => handleDeleteNote(note.id)}>מחק</button>
            </div>
            <span className={styles.timestamp}>
              {new Date(note.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesTaker;
