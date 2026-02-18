import React, { useState } from 'react';
import { useApi } from '../context/ApiContext';

const NoteCard = ({ note, onDelete, onUpdate }) => {
    const { api } = useApi();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put(`/notes/${note.id}`, { title, content });
            onUpdate(response.data);
            setIsEditing(false);
        } catch (err) {
            setError('Update failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!window.confirm('Delete this note?')) return;
        try {
            setLoading(true);
            setError(null);
            await api.delete(`/notes/${note.id}`);
            onDelete(note.id);
        } catch (err) {
            setError('Delete failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                border: isHovered ? '1px solid #e8eaed' : '1px solid #5f6368',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#202124',
                position: 'relative',
                transition: 'all 0.2s ease',
                boxShadow: isHovered ? '0 1px 3px 0 rgba(0,0,0,0.6), 0 4px 8px 3px rgba(0,0,0,0.3)' : 'none',
                minHeight: '100px',
                cursor: 'default',
                wordBreak: 'break-word'
            }}
        >
            {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        style={{
                            width: '100%',
                            backgroundColor: 'transparent',
                            border: 'none',
                            fontSize: '1.1em',
                            fontWeight: '500',
                            color: '#fff',
                            padding: '0'
                        }}
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content"
                        style={{
                            width: '100%',
                            minHeight: '80px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#e8eaed',
                            padding: '0',
                            resize: 'vertical'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                        <button
                            onClick={() => setIsEditing(false)}
                            style={{ backgroundColor: 'transparent', color: '#9aa0a6' }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            style={{
                                backgroundColor: '#a142f4',
                                color: 'white',
                                padding: '6px 16px',
                                borderRadius: '4px'
                            }}
                        >
                            {loading ? '...' : 'Save'}
                        </button>
                    </div>
                </div>
            ) : (
                <div onClick={() => setIsEditing(true)}>
                    {title && <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1em', color: '#fff' }}>{title}</h3>}
                    <p style={{ margin: 0, color: '#e8eaed', fontSize: '1em', whiteSpace: 'pre-wrap' }}>{content}</p>

                    <div style={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '15px',
                        opacity: isHovered ? 1 : 0,
                        transition: 'opacity 0.2s ease'
                    }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                            title="Edit"
                            style={{ background: 'transparent', padding: '4px', color: '#9aa0a6' }}
                        >
                            ✎
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            title="Delete"
                            style={{ background: 'transparent', padding: '4px', color: '#f28b82' }}
                        >
                            🗑
                        </button>
                    </div>
                </div>
            )}
            {error && <p style={{ color: '#f28b82', fontSize: '0.8em', marginTop: '10px' }}>{error}</p>}
        </div>
    );
};

export default NoteCard;
