import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "./AuthContext";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const router = useRouter();
  
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

  const { login } = useContext(AuthContext);

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
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Respuesta no es JSON válido:', text);
        data = {};
      }
      console.log('Respuesta login:', data);
      setLoading(false);

      if (!res.ok) {
        if (data.lockTimeLeft) {
          Alert.alert(
            "Cuenta bloqueada",
            `Espera ${data.lockTimeLeft} segundos e intenta de nuevo`
          );
        } else if (data.attemptsLeft !== undefined) {
          Alert.alert(
            "Error",
            `Contraseña incorrecta. Intentos restantes: ${data.attemptsLeft}`
          );
        } else {
          Alert.alert("Error", data.error || "Error al iniciar sesión");
        }
        return;
      }

      if (data.tipo !== "Cliente") {
        Alert.alert(
          "Acceso denegado",
          "Solo los clientes pueden iniciar sesión en esta aplicación."
        );
        return;
      }

      if (!data.id_usuario) {
        Alert.alert("Error", "No se recibió el ID del usuario");
        return;
      }

      // Guardamos el ID y demás info en AuthContext
      login({
        id: data.id_usuario,
        tipo: data.tipo,
        user: data.user,
      });

      // Redirigir a Rutinas después del login exitoso
      router.replace("/Rutinas");
    } catch (err) {
      setLoading(false);
      console.error("Error en login:", err);
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={user}
          onChangeText={setUser}
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconButton}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#1E90FF"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Text>
        </TouchableOpacity>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => router.push("/registro")}>
            <Text style={styles.link}>Crear cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/olvide-password")}>
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#222",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  iconButton: {
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linksContainer: {
    alignItems: "center",
  },
  link: {
    color: "#007AFF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },
});