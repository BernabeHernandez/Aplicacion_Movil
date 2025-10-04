import React, { createContext, useState } from "react";

export const AuthContext = createContext({
  id_usuario: null,
  userData: null,
  login: () => {},
});

export const AuthProvider = ({ children }) => {
  const [id_usuario, setIdUsuario] = useState(null);
  const [userData, setUserData] = useState(null);

  // Función para hacer login y guardar datos
  const login = ({ id, tipo, user }) => {
    setIdUsuario(id);
    setUserData({ tipo, user });
  };

  return (
    <AuthContext.Provider value={{ id_usuario, userData, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;