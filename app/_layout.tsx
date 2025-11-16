// app/_layout.tsx
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import AuthProvider from "./AuthContext";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { configureGoogleSignIn } from "../src/utils/googleSignIn";

const { width: screenWidth } = Dimensions.get("window");

function TabsLayout() {
  const { id_usuario } = useContext(AuthContext);

  return (
    <Tabs
      screenOptions={{
        headerTitle: () => (
          <Text style={styles.headerTitle} numberOfLines={1}>
            Centro de Rehabilitación Integral San Juan
          </Text>
        ),
        headerTitleAlign: "center",

        headerLeftContainerStyle: {
          width: 40,
        },

        headerRight: () => <View style={{ width: 40 }} />,

        headerLeft: () => (
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
            />
          </View>
        ),

        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#1976D2",
        tabBarInactiveTintColor: "#333",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* Pantalla de Login */}
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

      {/* Pantallas principales */}
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

      {/* Pantallas ocultas */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="RutinaDetalle" options={{ href: null }} />
      <Tabs.Screen name="+not-found" options={{ href: null }} />
      <Tabs.Screen name="AuthContext" options={{ href: null }} />
      <Tabs.Screen name="Notificaciones" options={{ href: null }} />
    </Tabs>
  );
}

export default function RootLayout() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <AuthProvider>
      <TabsLayout />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    flexShrink: 1,
  },
  logoContainer: {
    
  },
  logo: {
    width: 55,
    height: 55,
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
