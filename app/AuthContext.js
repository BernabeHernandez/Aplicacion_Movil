import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  id_usuario: null,
  userData: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [id_usuario, setIdUsuario] = useState(null);
  const [userData, setUserData] = useState(null);

  const login = ({ id, tipo, user }) => {
    setIdUsuario(id);
    setUserData({ tipo, user });
    AsyncStorage.setItem("userData", JSON.stringify({ id, tipo, user }));
  };

  const logout = async () => {
    try {
      setIdUsuario(null);
      setUserData(null);
      await AsyncStorage.removeItem("userData");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ id_usuario, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;