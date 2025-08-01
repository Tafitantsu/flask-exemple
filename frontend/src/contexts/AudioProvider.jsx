import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

// Create the context
const AudioContext = createContext(null);

// Custom hook to use the audio context
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

// Provider component
export const AudioProvider = ({ children }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Memoize audio objects to avoid creating new instances on every render
  const sounds = useMemo(() => ({
    click: new Audio('/audio/click.mp3'),
    success: new Audio('/audio/success.mp3'),
  }), []);

  // Preload sounds for better performance
  useMemo(() => {
    sounds.click.preload = 'auto';
    sounds.success.preload = 'auto';
  }, [sounds]);

  const playSound = useCallback((soundName) => {
    if (isAudioEnabled) {
      const sound = sounds[soundName];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.error(`Error playing ${soundName} sound:`, e));
      }
    }
  }, [isAudioEnabled, sounds]);

  const playClickSound = useCallback(() => playSound('click'), [playSound]);
  const playSuccessSound = useCallback(() => playSound('success'), [playSound]);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => {
      const isNowEnabled = !prev;
      // Play click sound when enabling audio
      if (isNowEnabled) {
        const sound = sounds.click;
        sound.currentTime = 0;
        sound.play().catch(e => console.error('Error playing click sound:', e));
      }
      return isNowEnabled;
    });
  }, [sounds.click]);

  // The value that will be supplied to any descendants of this provider
  const value = useMemo(() => ({
    isAudioEnabled,
    toggleAudio,
    playClickSound,
    playSuccessSound,
  }), [isAudioEnabled, toggleAudio, playClickSound, playSuccessSound]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
