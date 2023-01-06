import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(
    JSON.parse(localStorage.getItem("themeMode") || false)
  );

  const toggleTheme = () => {
    setThemeMode(!themeMode);
  };

  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, themeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
