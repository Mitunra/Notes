import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebaseConfig'; // Firestore config
import { collection, getDocs, addDoc, updateDoc, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'; // Firestore functions

function App() {
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState({});
  const [email, setEmail] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      const notesData = {};
      const querySnapshot = await getDocs(collection(db, 'notes'));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Store note with its ID
        if (notesData[data.date]) {
          notesData[data.date].push({ id: doc.id, note: data.note });
        } else {
          notesData[data.date] = [{ id: doc.id, note: data.note }];
        }
      });
      setNotes(notesData);
    };
    fetchNotes();
  }, []);

  // Handle saving the user email and reminder time
  const handleSavePreferences = async () => {
    const preferencesRef = doc(db, 'preferences', 'user1');
    const preferencesDoc = await getDoc(preferencesRef);
  
    if (!preferencesDoc.exists()) {
      // Create a new document if it doesn't exist
      await setDoc(preferencesRef, {
        email: email,
        reminderTime: reminderTime,
      });
    } else {
      // Update the existing document
      await updateDoc(preferencesRef, {
        email: email,
        reminderTime: reminderTime,
      });
    }
    alert('Preferences saved!');
  };
  
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (note && date) {
      const docRef = await addDoc(collection(db, 'notes'), {
        date: date,
        note: note,
      });

      // Add the note with its ID to the state
      setNotes((prevNotes) => ({
        ...prevNotes,
        [date]: [...(prevNotes[date] || []), { id: docRef.id, note: note }],
      }));
      setNote('');
    }
  };

  // Function to delete a note
  const handleDelete = async (noteId, noteDate) => {
    await deleteDoc(doc(db, 'notes', noteId));

    // Update the state to remove the deleted note
    setNotes((prevNotes) => ({
      ...prevNotes,
      [noteDate]: prevNotes[noteDate].filter(note => note.id !== noteId),
    }));
  };

  return (
    <div className="App">
      <div className="header-container">
        <h1>React Notes App</h1>
      </div>

      <h4>
        Enter the email for reminders:
        <br/>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </h4>

      <h4>
        Set reminder time: 
        <br/>
        <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
      </h4>

      <button onClick={handleSavePreferences}>Save Preferences</button>

      <hr/>

      <form onSubmit={handleSubmit}>
        <h4>Date:
          <br/>
          <input 
          type="date" 
          value={date} 
          onChange={handleDateChange} 
          name="date"
        /></h4>
        <br />
        <input 
          type="text" 
          value={note} 
          onChange={(e) => setNote(e.target.value)} 
          name="note" 
          placeholder="Enter your notes" 
        />
        <br />
        <button type="submit">Submit</button>
      </form>
      
      <h2>Notes for {date}:</h2>
      <ul>
        {(notes[date] || []).map((item) => (
          <li key={item.id} className="note-item">
            {item.note} 
            <button id='delete' onClick={() => handleDelete(item.id, date)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
