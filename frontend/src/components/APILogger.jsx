import React, { useContext } from 'react';
import { useApi } from '../context/ApiContext';

const APILogger = () => {
    const { logs } = useApi();

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '200px', // Fixed height
            overflowY: 'auto',
            backgroundColor: '#1e1e1e',
            color: '#00ff00',
            fontFamily: 'monospace',
            padding: '10px',
            borderTop: '2px solid #333',
            zIndex: 1000
        }}>
            <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                Middleware Visualization (Safe Mode)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                {logs.map((log) => (
                    <div key={log.id} style={{ marginBottom: '5px', borderBottom: '1px solid #333', paddingBottom: '2px' }}>
                        <span style={{ color: '#888' }}>[{log.timestamp}]</span>
                        <span style={{ color: log.method === 'GET' ? '#61dafb' : log.method === 'POST' ? '#f1c40f' : log.method === 'DELETE' ? '#e74c3c' : '#2ecc71', fontWeight: 'bold', marginLeft: '10px' }}>
                            {log.method}
                        </span>
                        <span style={{ marginLeft: '10px', color: '#fff' }}>{log.url}</span>
                        <span style={{
                            marginLeft: '10px',
                            color: log.status >= 200 && log.status < 300 ? '#2ecc71' : '#e74c3c',
                            fontWeight: 'bold'
                        }}>
                            {log.status === 'PENDING' ? '...' : log.status}
                        </span>
                        {log.duration && <span style={{ marginLeft: '10px', color: '#888' }}>({log.duration})</span>}
                        {log.message && <div style={{ color: '#e74c3c', marginLeft: '20px', fontSize: '0.9em' }}>Error: {log.message}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default APILogger;
