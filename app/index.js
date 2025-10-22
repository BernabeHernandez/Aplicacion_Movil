import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function Index() {
  const { id_usuario } = useContext(AuthContext);
  if (id_usuario) {
    return <Redirect href="/Rutinas" />;
  }
  return <Redirect href="/login" />;
}