import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") || null)
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  const login = async (payload) => {
    const res = await axiosInstance.post("/auth/login", payload);

    setCurrentUser(res.data);
  };

  const logout = async () => {
    await axiosInstance.post("/auth/logout");

    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
