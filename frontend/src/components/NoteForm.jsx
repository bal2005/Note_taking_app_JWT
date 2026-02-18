import React, { useState } from 'react';
import { useApi } from '../context/ApiContext';

const NoteForm = ({ onAdd }) => {
    const { api } = useApi();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title && !content) return;
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/notes', { title, content });
            onAdd(response.data);
            setTitle('');
            setContent('');
        } catch (err) {
            setError('Failed to add note');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Create New Note</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', fontSize: '1.1em', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <textarea
                        placeholder="Take a note..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        style={{ width: '100%', minHeight: '100px', padding: '10px', fontSize: '1em', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <button type="submit" disabled={loading} style={{
                    backgroundColor: '#007bff', color: 'white', padding: '10px 20px', fontSize: '1em', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.2s'
                }}>
                    {loading ? 'Adding...' : 'Add Note'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
        </div>
    );
};

export default NoteForm;
