import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebaseConfig'; // Firestore config
import { collection, getDocs, addDoc, query, where, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';// Firestore functions

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
        if (notesData[data.date]) {
          notesData[data.date].push(data.note);
        } else {
          notesData[data.date] = [data.note];
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
      await addDoc(collection(db, 'notes'), {
        date: date,
        note: note,
      });

      setNotes((prevNotes) => ({
        ...prevNotes,
        [date]: [...(prevNotes[date] || []), note],
      }));
      setNote('');
    }
  };

  return (
    <div className="App">
      <h1>React Notes App</h1>

      <h4>
        Enter the email for reminders: 
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </h4>

      <h4>
        Set reminder time: 
        <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
      </h4>

      <button onClick={handleSavePreferences}>Save Preferences</button>

      <form onSubmit={handleSubmit}>
        <input 
          type="date" 
          value={date} 
          onChange={handleDateChange} 
          name="date"
        />
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
        {(notes[date] || []).map((item, index) => (
          <li key={index}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
