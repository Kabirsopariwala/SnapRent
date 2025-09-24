import React, { createContext, useState, useEffect } from "react";

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState({
    theme: "Light",
    showTips: true,       // Show Tips/Hints
    enableSounds: true,   // Enable Sounds
    compactView: false,   // Compact view for UI
    emailNotifications: true, // Optional: if you want notifications here
    smsNotifications: false,  // Optional: if you want notifications here
  });

  // Apply theme to body
  useEffect(() => {
    document.body.className =
      preferences.theme === "Dark" ? "theme-dark" : "theme-light";
  }, [preferences.theme]);

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};
