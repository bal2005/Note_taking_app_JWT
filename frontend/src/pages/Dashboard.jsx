import React, { useState, useEffect } from 'react';
import { useApi } from '../context/ApiContext';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import APILogger from '../components/APILogger';

const Dashboard = () => {
    const { api, logout, user } = useApi();
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
            setError('Failed to load notes from the server.');
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
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#202124',
            paddingBottom: '220px'
        }}>
            {/* Navbar */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 24px',
                borderBottom: '1px solid #3c4043',
                backgroundColor: '#202124',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: '#a142f4',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '1.2em',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>N</div>
                    <h1 style={{ fontSize: '1.4em', color: '#e8eaed' }}>Premium Notes</h1>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: '#9aa0a6', fontSize: '0.9em' }}>Logged in as <strong style={{ color: '#fff' }}>{user?.username || 'Admin'}</strong></span>
                    <button onClick={logout} style={{
                        backgroundColor: 'transparent',
                        color: '#f28b82',
                        padding: '6px 12px',
                        border: '1px solid #5f6368',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}>
                        Logout
                    </button>
                </div>
            </nav>

            <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
                {/* Form Section */}
                <section style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
                    <NoteForm onAdd={handleNoteAdd} />
                </section>

                {/* Notes Section */}
                {error && (
                    <div style={{ textAlign: 'center', color: '#f28b82', marginBottom: '20px' }}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                        <div className="spinner" style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid #3c4043',
                            borderTopColor: '#a142f4',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }}></div>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '16px',
                        alignItems: 'start'
                    }}>
                        {notes.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', color: '#9aa0a6' }}>
                                <p style={{ fontSize: '1.2em' }}>No notes yet. Create your first one above!</p>
                            </div>
                        ) : (
                            notes.map(note => (
                                <NoteCard key={note.id} note={note} onDelete={handleNoteDelete} onUpdate={handleNoteUpdate} />
                            ))
                        )}
                    </div>
                )}
            </main>

            <APILogger />

            {/* Inline animation style */}
            <style>{`
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Dashboard;
