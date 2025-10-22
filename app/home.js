import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; 
import { AuthContext } from "./AuthContext"; 
import React from "react";

const Home = () => {
  const { id_usuario } = useContext(AuthContext);
  const navigation = useNavigation(); 
  const [userName, setUserName] = useState("Usuario"); 
  const [routinesProgress, setRoutinesProgress] = useState({ completed: 0, total: 0 });
  const [recommendedRoutines, setRecommendedRoutines] = useState([]); 

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`https://backendcentro.onrender.com/api/perfilcliente/${id_usuario}`);
      const data = await response.json();
      if (response.ok && data.nombre) {
        setUserName(data.nombre);
      } else {
        console.error("Error al obtener el perfil:", data.error || "Sin datos");
      }
    } catch (error) {
      console.error("Error en la llamada a la API de perfil:", error);
    }
  };

  const fetchRoutines = async () => {
    try {
      const response = await fetch(`https://backendcentro.onrender.com/api/rutinas/usuario/${id_usuario}`);
      const data = await response.json();
      if (response.ok) {
        // Filtrar rutinas activas basadas en el rango de fechas (fecha_inicio a fecha_fin)
        const today = new Date().toISOString().split("T")[0];
        const todayRoutines = data.filter((routine) => {
          const startDate = routine.fecha_inicio ? routine.fecha_inicio.split("T")[0] : null;
          const endDate = routine.fecha_fin ? routine.fecha_fin.split("T")[0] : null;
          return startDate && endDate && today >= startDate && today <= endDate;
        });

        // Contar rutinas completadas y totales
        const completed = todayRoutines.filter((routine) => routine.estado === "completada").length;
        const total = todayRoutines.length;
        setRoutinesProgress({ completed, total });

        // Mapear todas las rutinas activas para "Rutinas Recomendadas"
        const allRoutines = todayRoutines.map((routine) => {
          let duracion_total = 15;
          if (routine.pasos && routine.pasos.length > 0) {
            duracion_total = routine.pasos.reduce((sum, paso) => sum + (paso.tiempo_estimado * paso.repeticiones), 0);
          }

          return {
            id: routine.id_rutina,
            titulo: routine.titulo,
            descripcion: routine.descripcion,
            duracion_total: duracion_total,
            dificultad: routine.dificultad || "Fácil",
            estado: routine.estado,
          };
        });

        setRecommendedRoutines(allRoutines);
      } else {
        console.error("Error al obtener rutinas:", data.error || "Sin datos");
      }
    } catch (error) {
      console.error("Error en la llamada a la API de rutinas:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (id_usuario) {
        fetchUserProfile();
        fetchRoutines();
      }
    }, [id_usuario])
  );

  // Calcular porcentaje de progreso
  const progressPercentage = routinesProgress.total > 0 ? Math.round((routinesProgress.completed / routinesProgress.total) * 100) : 0;
  const pendingRoutines = routinesProgress.total - routinesProgress.completed;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>RehabBuddy</Text>
            <Text style={styles.headerSubtitle}>Centro de Rehabilitación San Juan</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>¡Hola, {userName}!</Text>
          <Text style={styles.subGreeting}>Continuemos con tu recuperación</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <View style={styles.statIcon}>
                <Text style={styles.statIconText}>○</Text>
              </View>
            </View>
            <View>
              <Text style={styles.statLabel}>Hoy</Text>
              <Text style={styles.statValue}>
                {routinesProgress.completed}/{routinesProgress.total} rutinas
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progreso de Hoy</Text>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
          </View>
          <Text style={styles.progressSubtext}>
            {pendingRoutines} {pendingRoutines === 1 ? "rutina pendiente" : "rutinas pendientes"}
          </Text>
        </View>

        {/* Recommended Routines */}
        <View style={styles.routinesSection}>
          <Text style={styles.routinesTitle}>Rutinas Recomendadas</Text>
          {recommendedRoutines.length > 0 ? (
            recommendedRoutines.map((routine) => (
              <View key={routine.id} style={styles.routineCard}>
                <View style={styles.routineContent}>
                  <Text style={styles.routineName}>{routine.titulo}</Text>
                  <Text style={styles.routineDescription}>{routine.descripcion}</Text>
                  <View style={styles.routineDetails}>
                    <View style={styles.routineDetail}>
                      <Text style={styles.routineDetailIcon}>⏱</Text>
                      <Text style={styles.routineDetailText}>{routine.duracion_total} min</Text>
                    </View>
                    <View style={styles.routineDetail}>
                      <Text style={styles.routineDetailText}>{routine.dificultad}</Text>
                    </View>
                  </View>
                </View>
                {routine.estado === "completada" ? (
                  <Text style={styles.completedText}>Completada</Text>
                ) : (
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => navigation.navigate('RutinaDetalle', { id_rutina: routine.id })}
                  >
                    <Text style={styles.startButtonText}>▶ Iniciar</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noRoutinesText}>No hay rutinas asignadas para hoy</Text>
          )}
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationalContainer}>
          <View style={styles.motivationalIcon}>
            <Text style={styles.motivationalIconText}>💡</Text>
          </View>
          <View style={styles.motivationalContent}>
            <Text style={styles.motivationalTitle}>¡Mantén la constancia!</Text>
            <Text style={styles.motivationalText}>
              La rehabilitación es un proceso gradual. Celebra cada pequeño avance en tu recuperación.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#689F38",
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
    marginTop: 2,
  },
  content: {
    padding: 20,
  },
  greetingSection: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    marginRight: 15,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
  },
  statIconText: {
    fontSize: 20,
    color: "#689F38",
  },
  fireIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8BC34A",
    justifyContent: "center",
    alignItems: "center",
  },
  fireIconText: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  progressSection: {
    marginBottom: 25,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#689F38",
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#689F38",
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: "#666",
  },
  routinesSection: {
    marginBottom: 25,
  },
  routinesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  routineCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routineContent: {
    flex: 1,
  },
  routineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  routineDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  routineDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  routineDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  routineDetailIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  routineDetailText: {
    fontSize: 12,
    color: "#666",
  },
  startButton: {
    backgroundColor: "#689F38",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  completedText: {
    color: "#689F38",
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  motivationalContainer: {
    flexDirection: "row",
    backgroundColor: "#E8F5E8",
    padding: 15,
    borderRadius: 12,
    alignItems: "flex-start",
  },
  motivationalIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  motivationalIconText: {
    fontSize: 20,
  },
  motivationalContent: {
    flex: 1,
  },
  motivationalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  motivationalText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  noRoutinesText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default Home;