import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const ApiContext = createContext();

export const useApi = () => useContext(ApiContext);

// Base API config
const api = axios.create({
    baseURL:'https://note-taking-app-jwt.onrender.com',
});

export const ApiProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Helper to add log
    const addLog = useCallback((log) => {
        setLogs((prev) => [log, ...prev].slice(0, 50)); // Keep last 50 logs
    }, []);

    // Login handler
    const login = async (username, password) => {
        try {
            console.log(`Attempting login for: ${username}`);
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

            const response = await api.post('/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token } = response.data;
            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser({ username });
            return true;
        } catch (error) {
            const errorMsg = error.response?.data?.detail || error.message;
            console.error("Login Error Details:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return false;
        }
    };

    // Logout handler
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Setup interceptors
    useEffect(() => {
        const reqInterceptor = api.interceptors.request.use(
            (config) => {
                // Add auth token
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Log request
                const logEntry = {
                    id: Date.now(),
                    timestamp: new Date().toLocaleTimeString(),
                    method: config.method.toUpperCase(),
                    url: config.url,
                    status: 'PENDING',
                    startTime: Date.now(),
                };
                // Attach log ID to config to update later
                config.metadata = { logId: logEntry.id, startTime: logEntry.startTime };
                addLog(logEntry);

                return config;
            },
            (error) => {
                addLog({
                    id: Date.now(),
                    timestamp: new Date().toLocaleTimeString(),
                    method: 'ERROR',
                    url: 'Request Setup',
                    status: 'FAILED',
                    message: error.message
                });
                return Promise.reject(error);
            }
        );

        const resInterceptor = api.interceptors.response.use(
            (response) => {
                // Update log to SUCCESS
                const { logId, startTime } = response.config.metadata || {};
                const duration = Date.now() - startTime;

                setLogs(prev => prev.map(log =>
                    log.id === logId
                        ? { ...log, status: response.status, duration: `${duration}ms`, responseData: 'Success' }
                        : log
                ));

                return response;
            },
            (error) => {
                // Update log to FAILED
                const config = error.config || {};
                const { logId, startTime } = config.metadata || {};
                const duration = startTime ? Date.now() - startTime : 0;

                if (logId) {
                    setLogs(prev => prev.map(log =>
                        log.id === logId
                            ? { ...log, status: error.response?.status || '500', duration: `${duration}ms`, message: error.message }
                            : log
                    ));
                } else {
                    // Log standalone error if request didn't start properly
                    addLog({
                        id: Date.now(),
                        timestamp: new Date().toLocaleTimeString(),
                        method: config.method?.toUpperCase() || 'UNKNOWN',
                        url: config.url || 'Unknown',
                        status: error.response?.status || 'ERROR',
                        message: error.message
                    });
                }

                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(reqInterceptor);
            api.interceptors.response.eject(resInterceptor);
        };
    }, [token, addLog]);

    return (
        <ApiContext.Provider value={{ api, logs, user, login, logout, token }}>
            {children}
        </ApiContext.Provider>
    );
};
