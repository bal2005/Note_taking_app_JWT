import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import APILogger from '../components/APILogger';

const Dashboard = () => {
    const { api, logout } = useApi();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/notes');
            setNotes(res.data);
        } catch (err) {
            setError('Failed to load notes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleNoteAdd = (newNote) => {
        setNotes([newNote, ...notes]);
    };

    const handleNoteDelete = (id) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    const handleNoteUpdate = (updatedNote) => {
        setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '220px', fontFamily: '"Segoe UI", sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1>My Notes</h1>
                <button onClick={logout} style={{
                    backgroundColor: '#333', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer'
                }}>
                    Logout
                </button>
            </header>

            <NoteForm onAdd={handleNoteAdd} />

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading ? (
                <p>Loading API...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {notes.map(note => (
                        <NoteCard key={note.id} note={note} onDelete={handleNoteDelete} onUpdate={handleNoteUpdate} />
                    ))}
                </div>
            )}

            <APILogger />
        </div>
    );
};

export default Dashboard;
