import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const USER_STORAGE_KEY = 'funGamesUsername';
const API_BASE_URL = 'http://localhost:8000/api';

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [username, setUsernameState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user`);
        const data = await response.json();
        if (data.username) {
          setUsernameState(data.username);
          localStorage.setItem(USER_STORAGE_KEY, data.username);
        } else {
          const storedUsername = localStorage.getItem(USER_STORAGE_KEY);
          if (storedUsername) {
            setUsernameState(storedUsername);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user from backend", error);
        const storedUsername = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUsername) {
          setUsernameState(storedUsername);
        }
      }
    };
    fetchUser();
  }, []);

  const setUsername = useCallback(async (name) => {
    if (name && name.trim()) {
      const trimmedName = name.trim();
      try {
        await fetch(`${API_BASE_URL}/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: trimmedName }),
        });
        localStorage.setItem(USER_STORAGE_KEY, trimmedName);
        setUsernameState(trimmedName);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to save username", error);
      }
    }
  }, []);

  const clearUsername = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/user`, { method: 'DELETE' });
      localStorage.removeItem(USER_STORAGE_KEY);
      setUsernameState(null);
    } catch (error) {
      console.error("Failed to clear username", error);
    }
  }, []);

  const openUsernameModal = useCallback(() => setIsModalOpen(true), []);
  const closeUsernameModal = useCallback(() => setIsModalOpen(false), []);

  const value = useMemo(() => ({
    username,
    setUsername,
    clearUsername,
    isModalOpen,
    openUsernameModal,
    closeUsernameModal,
  }), [username, setUsername, clearUsername, isModalOpen, openUsernameModal, closeUsernameModal]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};