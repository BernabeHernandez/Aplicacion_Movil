import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native"; 
import { AuthContext } from "./AuthContext"; 

const Perfil = () => {
  const { id_usuario, logout, isLoading } = useContext(AuthContext);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchPerfil = async () => {
      if (isLoading) {
        return;
      }

      if (!id_usuario) {
        setError("No se encontró el ID del usuario. Por favor, inicia sesión.");
        setLoading(false);
        navigation.reset({
          index: 0,
          routes: [{ name: "login" }],
        });
        return;
      }

      try {
        const response = await axios.get(`https://backendcentro.onrender.com/api/perfilcliente/${id_usuario}`);
        console.log("Respuesta del backend (GET):", response.data);
        const perfilData = response.data;
        if (!perfilData || !perfilData.id) {
          throw new Error("No se encontraron datos del perfil");
        }
        setPerfil(perfilData);
        setFormData({
          nombre: perfilData.nombre || "",
          apellidopa: perfilData.apellidopa || "",
          apellidoma: perfilData.apellidoma || "",
          gmail: perfilData.gmail || "",
          user: perfilData.user || "",
          telefono: perfilData.telefono || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Error al cargar el perfil");
        setLoading(false);
        console.error("Error en fetchPerfil:", err);
      }
    };

    fetchPerfil();
  }, [id_usuario, navigation, isLoading]);

  const handleUpdatePerfil = async () => {
    try {
      await axios.put(`https://backendcentro.onrender.com/api/perfilcliente/${id_usuario}`, formData);
      console.log("Datos enviados en PUT:", formData);
      const response = await axios.get(`https://backendcentro.onrender.com/api/perfilcliente/${id_usuario}`);
      console.log("Respuesta del backend (GET después de PUT):", response.data);
      const updatedPerfil = response.data;
      setPerfil(updatedPerfil);
      setShowModal(false);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      Alert.alert("Error", "No se pudo actualizar el perfil. Inténtalo de nuevo.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  if (isLoading || loading) {
    return <Text>Cargando...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>RehabBuddy</Text>
              <Text style={styles.headerSubtitle}>Centro de Rehabilitación San Juan</Text>
            </View>
            <View style={styles.avatarContainer}></View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Mi Perfil</Text>
            <Text style={styles.subtitle}>Gestiona tu cuenta y progreso</Text>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileAvatarContainer}>
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarIcon}>👤</Text>
                </View>
                <View style={styles.checkBadge}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {perfil ? `${perfil.nombre || ''} ${perfil.apellidopa || ''}` : "Cargando..."}
                </Text>
                <Text style={styles.profileEmail}>{perfil ? perfil.gmail || '' : "Cargando..."}</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={[styles.statCircle, { backgroundColor: "#E8F5E8" }]}>
                  <Text style={styles.statIcon}>🏃</Text>
                </View>
                <Text style={styles.statNumber}>42</Text>
                <Text style={styles.statLabel}>Rutinas</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statCircle, { backgroundColor: "#FFF9C4" }]}>
                  <Text style={styles.statIcon}>⚡</Text>
                </View>
                <Text style={styles.statNumber}>156</Text>
                <Text style={styles.statLabel}>Sesiones</Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statCircle, { backgroundColor: "#E3F2FD" }]}>
                  <Text style={styles.statIcon}>📅</Text>
                </View>
                <Text style={styles.statNumber}>7</Text>
                <Text style={styles.statLabel}>Días seguidos</Text>
              </View>
            </View>
          </View>

          {/* Menu Options */}
          <View style={styles.menuSection}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setShowModal(true)}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, { backgroundColor: "#E8F5E8" }]}>
                  <Text style={styles.menuIconText}>✏️</Text>
                </View>
                <View>
                  <Text style={styles.menuTitle}>Editar Perfil</Text>
                  <Text style={styles.menuSubtitle}>Actualiza tu información personal</Text>
                </View>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Center Info */}
          <View style={styles.centerInfo}>
            <Text style={styles.centerTitle}>Centro de Rehabilitación San Juan</Text>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={styles.contactText}>+1 (555) 123-4567</Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>✉️</Text>
              <Text style={styles.contactText}>info@centrosanjuan.com</Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              logout();
              navigation.reset({
                index: 0,
                routes: [{ name: "login" }],
              });
            }}
          >
            <Text style={styles.logoutText}>🔓 Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal para editar perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre"
              value={formData.nombre}
              onChangeText={(text) => handleInputChange("nombre", text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Apellido Paterno"
              value={formData.apellidopa}
              onChangeText={(text) => handleInputChange("apellidopa", text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Apellido Materno"
              value={formData.apellidoma}
              onChangeText={(text) => handleInputChange("apellidoma", text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Correo Electrónico"
              value={formData.gmail}
              onChangeText={(text) => handleInputChange("gmail", text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre de usuario"
              value={formData.user}
              onChangeText={(text) => handleInputChange("user", text)}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Teléfono"
              value={formData.telefono}
              onChangeText={(text) => handleInputChange("telefono", text)}
              keyboardType="phone-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleUpdatePerfil}>
                <Text style={styles.modalSaveButtonText}>Guardar Cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancelButton} onPress={handleCloseModal}>
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#7CB342",
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
  },
  avatarContainer: {
    position: "relative",
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  profileCard: {
    backgroundColor: "#E8F5E8",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileAvatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  profileAvatarIcon: {
    fontSize: 24,
  },
  checkBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  checkIcon: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  menuSection: {
    marginBottom: 25,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuIconText: {
    fontSize: 18,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  menuArrow: {
    fontSize: 20,
    color: "#999",
  },
  centerInfo: {
    backgroundColor: "#E8F5E8",
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  centerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  contactText: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E91E63",
  },
  logoutText: {
    fontSize: 16,
    color: "#E91E63",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: "#7CB342",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginRight: 10,
  },
  modalSaveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E91E63",
    marginLeft: 10,
  },
  modalCancelButtonText: {
    color: "#E91E63",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Perfil;