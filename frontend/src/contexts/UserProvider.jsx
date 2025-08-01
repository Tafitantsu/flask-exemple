import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const USER_STORAGE_KEY = 'funGamesUsername';

// Create the context
const UserContext = createContext(null);

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider component
export const UserProvider = ({ children }) => {
  const [username, setUsernameState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load username from localStorage on initial render
  useEffect(() => {
    try {
      const storedUsername = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUsername) {
        setUsernameState(storedUsername);
      }
    } catch (error) {
      console.error("Failed to read username from localStorage", error);
    }
  }, []);

  const setUsername = useCallback((name) => {
    if (name && name.trim()) {
      const trimmedName = name.trim();
      try {
        localStorage.setItem(USER_STORAGE_KEY, trimmedName);
        setUsernameState(trimmedName);
        setIsModalOpen(false); // Close modal on successful submission
      } catch (error) {
        console.error("Failed to save username to localStorage", error);
      }
    }
  }, []);

  const clearUsername = useCallback(() => {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUsernameState(null);
    } catch (error) {
      console.error("Failed to remove username from localStorage", error);
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
