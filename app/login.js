import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Linking, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { AuthContext } from "./AuthContext";

// Firebase & Google
import { auth } from "../src/config/firebaseConfig";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const router = useRouter();
  const { login } = useContext(AuthContext);

  //NOTIFICACIONES
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      let token;
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('No se pudo obtener permiso para notificaciones push.');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
    };
    registerForPushNotificationsAsync();
  }, []);

  // LOGIN NORMAL
  const handleLogin = async () => {
    if (!user || !password) {
      Alert.alert("Error", "Por favor, ingrese usuario y contraseña");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://backendcentro.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password, expo_push_token: expoPushToken }),
      });

      const text = await res.text();
      let data = {};
      try { data = text ? JSON.parse(text) : {}; } catch (e) { console.error('JSON inválido:', text); }

      setLoading(false);

      if (!res.ok) {
        if (data.lockTimeLeft) {
          Alert.alert("Cuenta bloqueada", `Espera ${data.lockTimeLeft} segundos`);
        } else if (data.attemptsLeft !== undefined) {
          Alert.alert("Error", `Contraseña incorrecta. Intentos restantes: ${data.attemptsLeft}`);
        } else {
          Alert.alert("Error", data.error || "Error al iniciar sesión");
        }
        return;
      }

      if (data.tipo !== "Cliente") {
        Alert.alert("Acceso denegado", "Solo clientes pueden usar esta app");
        return;
      }

      if (!data.id_usuario) {
        Alert.alert("Error", "No se recibió el ID del usuario");
        return;
      }

      login({ id: data.id_usuario, tipo: data.tipo, user: data.user });
      router.replace("/home");
    } catch (err) {
      setLoading(false);
      console.error("Error en login:", err);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  //LOGIN CON GOOGLE
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // Verificar Play Services
      await GoogleSignin.hasPlayServices();

      // Iniciar sesión con Google
      const userInfo = await GoogleSignin.signIn();
      
      // CAMBIO CRÍTICO: Obtener idToken correctamente
      const idToken = userInfo.data?.idToken || userInfo.idToken;
      
      // Validar que tenemos el idToken
      if (!idToken) {
        console.error('No se obtuvo idToken. userInfo:', JSON.stringify(userInfo, null, 2));
        Alert.alert("Error", "No se pudo obtener el token de Google");
        setLoading(false);
        return;
      }

      console.log('idToken obtenido correctamente');

      // 3. Crear credencial Firebase
      const credential = GoogleAuthProvider.credential(idToken);
      const firebaseUser = await signInWithCredential(auth, credential);

      const { uid, email, displayName } = firebaseUser.user;

      // 4. Enviar al backend
      console.log('Enviando al backend:', { google_uid: uid, email, name: displayName });
      
      const res = await fetch("https://backendcentro.onrender.com/api/login/login-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          google_uid: uid,
          email,
          name: displayName || email.split('@')[0],
          expo_push_token: expoPushToken,
        }),
      });

      // 🔍 DEBUG: Ver qué devuelve el servidor
      const responseText = await res.text();
      console.log('📡 Status del servidor:', res.status);
      console.log('📡 Respuesta del servidor:', responseText.substring(0, 300));

      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
        console.log('Datos parseados:', data);
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError);
        console.error('Respuesta HTML recibida:', responseText.substring(0, 500));
        Alert.alert(
          "Error del servidor",
          `El servidor devolvió HTML. Verifica que el endpoint /api/login-google exista. Status: ${res.status}`
        );
        return;
      }

      if (!res.ok) {
        console.error('Error del servidor:', data);
        Alert.alert("Error", data.error || `Error del servidor (${res.status})`);
        return;
      }

      if (data.tipo !== "Cliente") {
        Alert.alert("Acceso denegado", "Solo clientes pueden usar esta app");
        return;
      }

      login({ id: data.id_usuario, tipo: data.tipo, user: data.user });
      router.replace("/home");
    } catch (error) {
      console.error("Google Login Error:", error);
      
      if (error.code === 'DEVELOPER_ERROR') {
        Alert.alert("Error de configuración", "Revisa webClientId en app.json");
      } else if (error.code === 'SIGN_IN_CANCELLED' || error.code === 'USER_CANCELLED') {
        // Usuario canceló, no hacer nada
        console.log('Usuario canceló el login');
      } else if (error.code === 'IN_PROGRESS') {
        Alert.alert("Espera", "Ya hay un proceso de login en curso");
      } else {
        Alert.alert("Error", "No se pudo iniciar con Google. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <TextInput style={styles.input} placeholder="Usuario" value={user} onChangeText={setUser} autoCapitalize="none" placeholderTextColor="#aaa" />

        <View style={styles.passwordContainer}>
          <TextInput style={styles.passwordInput} placeholder="Contraseña" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} placeholderTextColor="#aaa" />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconButton}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#1E90FF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Ingresando..." : "Ingresar"}</Text>
        </TouchableOpacity>

        {/* BOTÓN DE GOOGLE */}
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={handleGoogleLogin} disabled={loading}>
          <Image source={require("../assets/images/logo1.png")} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>{loading ? "Conectando..." : "Continuar con Google"}</Text>
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => Linking.openURL("https://centrorehabilitacion-sepia.vercel.app/registro")}>
            <Text style={styles.link}>Crear cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://centrorehabilitacion-sepia.vercel.app/verificar_correo")}>
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", justifyContent: "center" },
  content: { paddingHorizontal: 30 },
  title: { fontSize: 32, fontWeight: "700", color: "#222", marginBottom: 5, textAlign: "center" },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 30, textAlign: "center" },
  input: { height: 50, borderColor: "#ddd", borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, backgroundColor: "#fff" },
  passwordContainer: { flexDirection: "row", alignItems: "center", borderColor: "#ddd", borderWidth: 1, borderRadius: 10, marginBottom: 15, backgroundColor: "#fff" },
  passwordInput: { flex: 1, height: 50, paddingHorizontal: 15 },
  iconButton: { paddingHorizontal: 15, justifyContent: "center", alignItems: "center" },
  button: { backgroundColor: "#007AFF", paddingVertical: 15, borderRadius: 10, alignItems: "center", marginBottom: 15 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  googleButton: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#ddd", flexDirection: "row", justifyContent: "center" },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleButtonText: { color: "#333", fontSize: 16, fontWeight: "600" },
  linksContainer: { alignItems: "center" },
  link: { color: "#007AFF", fontSize: 14, textAlign: "center", marginTop: 10 },
});