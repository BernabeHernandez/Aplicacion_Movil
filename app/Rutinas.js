import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "./AuthContext";

const Rutinas = () => {
  const router = useRouter();
  const { id_usuario } = useContext(AuthContext);

  const [selectedTab, setSelectedTab] = useState("Cervical");
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categoryMap = { Cervical: 1, Lumbar: 2, General: 3 };
  const tabs = ["Cervical", "Lumbar", "General"];

  const defaultRoutineData = {
    Cervical: { duration: "15 min", exercises: "5 ejercicios", difficulty: "Fácil" },
    Lumbar: { duration: "20 min", exercises: "7 ejercicios", difficulty: "Medio" },
    General: { duration: "25 min", exercises: "10 ejercicios", difficulty: "Medio" },
  };

  useEffect(() => {
    // Espera a que id_usuario exista
    if (!id_usuario) {
      // Redirige al login si no hay usuario
      router.replace("/login");
      return;
    }

    const fetchRoutines = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoryId = categoryMap[selectedTab];
        const response = await fetch(
          `https://backendcentro.onrender.com/api/rutinas/usuario/${id_usuario}/categoria/${categoryId}`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Error al cargar rutinas: ${response.status} ${text}`);
        }

        const data = await response.json();
        setRoutines(data);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, [selectedTab, id_usuario]);

  // Obtiene la imagen del primer paso con imagen disponible
  const getRoutineImage = (routine) => {
    if (Array.isArray(routine.pasos) && routine.pasos.length > 0) {
      // Busca el primer paso con imagen no vacía
      const pasoConImagen = routine.pasos.find((p) => p.imagen && p.imagen !== "");
      if (pasoConImagen) return pasoConImagen.imagen;
    }
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HXvApelNZvniviGtpKO4kpAfSw2aqJ.png";
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>RehabBuddy</Text>
            <Text style={styles.headerSubtitle}>Centro de Rehabilitación San Juan</Text>
          </View>
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Rutinas de Rehabilitación</Text>
        <Text style={styles.subtitle}>Elige tu rutina según tu zona de tratamiento</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Error */}
        {error && !loading && (
          <View style={styles.noRoutinesContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Rutinas */}
        {routines.map((routine, index) => {
          // Si la API ya trae los pasos como array, podemos mostrar el número real de ejercicios
          const numEjercicios = Array.isArray(routine.pasos) ? routine.pasos.length : 0;
          const routineInfo = {
            title: routine.titulo || "Sin título",
            description: routine.descripcion || "Sin descripción",
            duration: defaultRoutineData[selectedTab].duration, // Puedes ajustar si tienes duración real
            exercises: numEjercicios > 0 ? `${numEjercicios} ejercicios` : defaultRoutineData[selectedTab].exercises,
            difficulty: defaultRoutineData[selectedTab].difficulty, // Puedes ajustar si tienes dificultad real
          };

          return (
            <View key={routine.id_rutina || index} style={styles.routineContainer}>
              <Image
                source={{ uri: getRoutineImage(routine) }}
                style={styles.routineImage}
                resizeMode="cover"
              />
              <View style={styles.routineInfo}>
                <Text style={styles.routineTitle}>{routineInfo.title}</Text>
                <Text style={styles.routineDescription}>{routineInfo.description}</Text>

                <View style={styles.routineDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>⏱</Text>
                    <Text style={styles.detailText}>{routineInfo.duration}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailIcon}>👥</Text>
                    <Text style={styles.detailText}>{routineInfo.exercises}</Text>
                  </View>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>{routineInfo.difficulty}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() =>
                    router.push({ pathname: "/RutinaDetalle", params: { id_rutina: routine.id_rutina } })
                  }
                >
                  <Text style={styles.startButtonIcon}>▶</Text>
                  <Text style={styles.startButtonText}>Ver Detalles</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Cargando rutinas...</Text>
          </View>
        )}

        {/* Sin rutinas */}
        {!loading && routines.length === 0 && !error && (
          <View style={styles.noRoutinesContainer}>
            <Text style={styles.noRoutinesText}>
              No hay rutinas disponibles para esta categoría.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7CB342",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 30,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#333",
    fontWeight: "600",
  },
  loadingContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  routineContainer: {
    marginBottom: 30,
  },
  imageContainer: {
    marginBottom: 25,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  routineImage: {
    width: "100%",
    height: 200,
  },
  routineInfo: {
    marginBottom: 30,
  },
  routineTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  routineDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 22,
  },
  routineDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  difficultyBadge: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#7CB342",
  },
  difficultyText: {
    color: "#7CB342",
    fontSize: 14,
    fontWeight: "600",
  },
  startButton: {
    backgroundColor: "#7CB342",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  startButtonIcon: {
    color: "white",
    fontSize: 16,
    marginRight: 10,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  statsCard: {
    backgroundColor: "#E3F2FD",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1976D2",
    marginBottom: 15,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "500",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
  noRoutinesContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  noRoutinesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
})

export default Rutinas