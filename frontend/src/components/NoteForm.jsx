import React, { useState, useRef, useEffect } from 'react';
import { useApi } from '../context/ApiContext';

const NoteForm = ({ onAdd }) => {
    const { api } = useApi();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const formRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title && !content) {
            setIsExpanded(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/notes', { title, content });
            onAdd(response.data);
            setTitle('');
            setContent('');
            setIsExpanded(false);
        } catch (err) {
            setError('Failed to add note');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Close form when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                if (!title && !content) {
                    setIsExpanded(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [title, content]);

    return (
        <div
            ref={formRef}
            style={{
                width: '100%',
                maxWidth: '600px',
                backgroundColor: '#202124',
                border: '1px solid #5f6368',
                borderRadius: '8px',
                boxShadow: isExpanded ? '0 1px 3px 0 rgba(0,0,0,0.6), 0 4px 8px 3px rgba(0,0,0,0.3)' : '0 1px 2px 0 rgba(0,0,0,0.6)',
                transition: 'all 0.2s ease-in-out',
                overflow: 'hidden'
            }}
        >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                {isExpanded && (
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            border: 'none',
                            padding: '12px 16px',
                            fontSize: '1.1em',
                            fontWeight: '500',
                            backgroundColor: 'transparent',
                            color: '#fff'
                        }}
                    />
                )}

                <textarea
                    placeholder="Take a note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                    style={{
                        border: 'none',
                        minHeight: isExpanded ? '100px' : '46px',
                        padding: '12px 16px',
                        fontSize: '1em',
                        backgroundColor: 'transparent',
                        color: '#e8eaed',
                        resize: 'none',
                        transition: 'min-height 0.2s ease'
                    }}
                />

                {isExpanded && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 16px',
                        borderTop: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div style={{ color: '#f28b82', fontSize: '0.85em' }}>{error}</div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                style={{ backgroundColor: 'transparent', color: '#9aa0a6' }}
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    backgroundColor: '#a142f4',
                                    color: 'white',
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    fontWeight: '600',
                                    border: 'none',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? '...' : 'Save'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default NoteForm;
