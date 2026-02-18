import React, { useState } from 'react';
import { useApi } from '../context/ApiContext';

const NoteCard = ({ note, onDelete, onUpdate }) => {
    const { api } = useApi();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put(`/notes/${note.id}`, { title, content });
            onUpdate(response.data);
            setIsEditing(false);
        } catch (err) {
            setError('Failed to update note');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            setLoading(true);
            setError(null);
            await api.delete(`/notes/${note.id}`);
            onDelete(note.id);
        } catch (err) {
            setError('Failed to delete note');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            margin: '8px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', marginBottom: '8px', padding: '4px' }}
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        style={{ width: '100%', minHeight: '100px', marginBottom: '8px', padding: '4px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={handleUpdate} disabled={loading} style={{
                            backgroundColor: '#28a745', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => setIsEditing(false)} disabled={loading} style={{
                            backgroundColor: '#6c757d', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{title}</h3>
                    <p style={{ margin: '0 0 16px 0', color: '#666', whiteSpace: 'pre-wrap' }}>{content}</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => setIsEditing(true)} style={{
                            backgroundColor: '#007bff', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}>
                            Edit
                        </button>
                        <button onClick={handleDelete} disabled={loading} style={{
                            backgroundColor: '#dc3545', color: 'white', padding: '4px 8px', border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}>
                            {loading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            )}
            {error && <p style={{ color: 'red', fontSize: '0.9em', marginTop: '8px' }}>{error}</p>}
        </div>
    );
};

export default NoteCard;
