// app/_layout.tsx
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput, View, Image, StyleSheet, Dimensions } from "react-native";
import AuthProvider from "./AuthContext";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const { width: screenWidth } = Dimensions.get("window");
const searchWidth = Math.min(Math.max(screenWidth * 0.6, 200), 300);

function TabsLayout() {
  const { id_usuario } = useContext(AuthContext);

  return (
    <Tabs
      screenOptions={{
        headerTitle: () => (
          <View style={[styles.searchWrapper, { width: searchWidth }]}>
            <MaterialIcons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Buscar rutinas, ejercicios..."
              placeholderTextColor="#999"
              style={styles.searchBar}
            />
          </View>
        ),
        headerTitleAlign: "center",
        headerTitleContainerStyle: {
          flex: 1,
          alignItems: "center",
        },
        headerRight: () => (
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>
        ),
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#1976D2",
        tabBarInactiveTintColor: "#666",
      }}
    >
      {/* Pantalla de Login - Solo visible si NO está autenticado */}
      <Tabs.Screen
        name="login"
        options={{
          title: "Iniciar Sesión",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="login" size={size} color={color} />
          ),
          href: id_usuario ? null : "/login",
        }}
      />

      {/* Pantallas principales - Solo visibles si está autenticado */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          href: id_usuario ? "/home" : null,
        }}
      />
      <Tabs.Screen
        name="Rutinas"
        options={{
          title: "Rutinas",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="fitness-center" size={size} color={color} />
          ),
          href: id_usuario ? "/Rutinas" : null,
        }}
      />
      <Tabs.Screen
        name="Progreso"
        options={{
          title: "Progreso",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="trending-up" size={size} color={color} />
          ),
          href: id_usuario ? "/Progreso" : null,
        }}
      />
      <Tabs.Screen
        name="Tips"
        options={{
          title: "Tips",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="notifications" size={size} color={color} />
          ),
          href: id_usuario ? "/Tips" : null,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
          href: id_usuario ? "/perfil" : null,
        }}
      />

      {/* Pantallas ocultas del tab bar */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="RutinaDetalle" options={{ href: null }} />
      <Tabs.Screen name="+not-found" options={{ href: null }} />
      <Tabs.Screen name="AuthContext" options={{ href: null }} />
      <Tabs.Screen name="Notificaciones" options={{ href: null }} />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TabsLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchBar: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    paddingVertical: 0,
  },
  logoContainer: {
    marginRight: 15,
  },
  logo: {
    width: 36,
    height: 36,
    resizeMode: "contain",
  },
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
});