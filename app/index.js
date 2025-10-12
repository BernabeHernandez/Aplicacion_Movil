// app/index.tsx
import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function Index() {
  const { id_usuario } = useContext(AuthContext);

  // Si el usuario está autenticado, redirigir a Rutinas
  // Si no está autenticado, redirigir a login
  if (id_usuario) {
    return <Redirect href="/Rutinas" />;
  }

  return <Redirect href="/login" />;
}