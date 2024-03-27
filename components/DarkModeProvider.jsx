import React, { createContext, useState, useContext } from 'react';

// Create a context for dark mode state
const DarkModeContext = createContext();

// Create a DarkModeProvider component to wrap your app and provide the dark mode state
export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default dark mode is false

  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to access dark mode state and setter
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};