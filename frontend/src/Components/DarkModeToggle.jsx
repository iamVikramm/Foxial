import React, { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for the user's preference in local storage on component mount
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setDarkMode(storedDarkMode === 'true');
    }
  }, []);

  const toggleDarkMode = () => {
    // Toggle the dark mode state
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
    // Save the user's preference in local storage
    localStorage.setItem('darkMode', !darkMode);
  };

  return (
    <div className={`toggle-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <button onClick={toggleDarkMode} className="toggle-button">
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
};

export default DarkModeToggle;
