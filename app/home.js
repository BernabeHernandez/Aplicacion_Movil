import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native"

const Home = () => {
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
          <Text style={styles.greeting}>¡Hola, María!</Text>
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
              <Text style={styles.statValue}>2/4 rutinas</Text>
            </View>
          </View>

          <View style={styles.statItem}>
            <View style={styles.statIconContainer}>
              <View style={styles.fireIcon}>
                <Text style={styles.fireIconText}>🔥</Text>
              </View>
            </View>
            <View>
              <Text style={styles.statLabel}>Racha</Text>
              <Text style={styles.statValue}>7 días</Text>
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progreso de Hoy</Text>
            <Text style={styles.progressPercentage}>50%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
          <Text style={styles.progressSubtext}>2 rutinas pendientes</Text>
        </View>

        {/* Reminder */}
        <View style={styles.reminderContainer}>
          <View style={styles.reminderIcon}>
            <Text style={styles.reminderIconText}>⏰</Text>
          </View>
          <View style={styles.reminderContent}>
            <Text style={styles.reminderTitle}>Próximo recordatorio</Text>
            <Text style={styles.reminderTime}>14:30 - Estiramiento Cervical</Text>
          </View>
        </View>

        {/* Recommended Routines */}
        <View style={styles.routinesSection}>
          <Text style={styles.routinesTitle}>Rutinas Recomendadas</Text>

          {/* Routine 1 */}
          <View style={styles.routineCard}>
            <View style={styles.routineContent}>
              <Text style={styles.routineName}>Estiramiento Cervical Básico</Text>
              <Text style={styles.routineDescription}>Ejercicios suaves para aliviar la tensión cervical</Text>
              <View style={styles.routineDetails}>
                <View style={styles.routineDetail}>
                  <Text style={styles.routineDetailIcon}>⏱</Text>
                  <Text style={styles.routineDetailText}>15 min</Text>
                </View>
                <View style={styles.routineDetail}>
                  <Text style={styles.routineDetailText}>Fácil</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>▶ Iniciar</Text>
            </TouchableOpacity>
          </View>

          {/* Routine 2 */}
          <View style={styles.routineCard}>
            <View style={styles.routineContent}>
              <Text style={styles.routineName}>Fortalecimiento Lumbar</Text>
              <Text style={styles.routineDescription}>Ejercicios para fortalecer la zona lumbar</Text>
              <View style={styles.routineDetails}>
                <View style={styles.routineDetail}>
                  <Text style={styles.routineDetailIcon}>⏱</Text>
                  <Text style={styles.routineDetailText}>20 min</Text>
                </View>
                <View style={styles.routineDetail}>
                  <Text style={styles.routineDetailText}>Medio</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>▶ Iniciar</Text>
            </TouchableOpacity>
          </View>
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
  )
}

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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
    width: "50%",
    backgroundColor: "#689F38",
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 14,
    color: "#666",
  },
  reminderContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF9C4",
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    alignItems: "center",
  },
  reminderIcon: {
    marginRight: 12,
  },
  reminderIconText: {
    fontSize: 20,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  reminderTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
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
})

export default Home
