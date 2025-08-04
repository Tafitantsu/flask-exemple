import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserContext } from './UserContext';

const USER_STORAGE_KEY = 'funGamesUsername';
import ApiCall from '@utils/ApiCall';

export const UserProvider = ({ children }) => {
  const [username, setUsernameState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await ApiCall('/user');
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
        await ApiCall('/user', {
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
      await ApiCall('/user', { method: 'DELETE' });
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