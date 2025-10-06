import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"

const Progreso = () => {
  const weekDays = [
    { day: "Lun", number: 1, completed: true },
    { day: "Mar", number: 2, completed: true },
    { day: "Mié", number: 3, completed: true },
    { day: "Jue", number: 4, completed: true },
    { day: "Vie", number: 5, completed: true },
    { day: "Vie", number: 6, completed: true },
    { day: "Dom", number: 7, completed: false },
  ]

  const achievements = [
    {
      title: "7 días consecutivos",
      date: "17/8/2024",
      icon: "🔥",
      completed: true,
      bgColor: "#FFF3E0",
    },
    {
      title: "50 ejercicios completados",
      date: "14/8/2024",
      icon: "✓",
      completed: true,
      bgColor: "#E8F5E8",
    },
    {
      title: "Primera semana",
      date: "9/8/2024",
      icon: "☀️",
      completed: true,
      bgColor: "#FFF9C4",
    },
    {
      title: "30 días seguidos",
      date: "",
      icon: "👑",
      completed: false,
      bgColor: "#F5F5F5",
    },
  ]

  return (
    <ScrollView style={styles.container}>
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
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Tu Progreso</Text>
          <Text style={styles.subtitle}>Seguimiento de tu recuperación</Text>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.medalIcon}>
            <Text style={styles.medalEmoji}>🏆</Text>
          </View>
          <Text style={styles.streakNumber}>7 días</Text>
          <Text style={styles.streakLabel}>Racha actual</Text>
          <Text style={styles.streakMessage}>¡Excelente trabajo! Mantén el ritmo</Text>
        </View>

        {/* Weekly Calendar */}
        <View style={styles.weekSection}>
          <Text style={styles.sectionTitle}>📅 Esta Semana</Text>
          <View style={styles.weekDays}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.dayContainer}>
                <Text style={styles.dayLabel}>{day.day}</Text>
                <View style={[styles.dayCircle, { backgroundColor: day.completed ? "#7CB342" : "#E0E0E0" }]}>
                  <Text style={[styles.dayNumber, { color: day.completed ? "white" : "#999" }]}>{day.number}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>
            <Text style={styles.statValue}>42/45</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: "93%" }]} />
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statLabel}>Promedio diario</Text>
            </View>
            <Text style={styles.statValue}>2.1 rutinas</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Logros</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.achievementCard,
                  { backgroundColor: achievement.bgColor },
                  !achievement.completed && styles.achievementLocked,
                ]}
              >
                <Text style={[styles.achievementIcon, !achievement.completed && styles.achievementIconLocked]}>
                  {achievement.icon}
                </Text>
                <Text style={[styles.achievementTitle, !achievement.completed && styles.achievementTextLocked]}>
                  {achievement.title}
                </Text>
                {achievement.date && (
                  <Text style={[styles.achievementDate, !achievement.completed && styles.achievementTextLocked]}>
                    {achievement.date}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Monthly Summary */}
        <View style={styles.monthlySummary}>
          <Text style={styles.monthlyTitle}>Resumen del Mes</Text>
          <View style={styles.monthlyStats}>
            <View style={styles.monthlyStatItem}>
              <Text style={styles.monthlyStatValue}>93%</Text>
              <Text style={styles.monthlyStatLabel}>Adherencia</Text>
            </View>
            <View style={styles.monthlyStatItem}>
              <Text style={styles.monthlyStatValue}>126</Text>
              <Text style={styles.monthlyStatLabel}>Mejor racha</Text>
            </View>
            <View style={styles.monthlyStatItem}>
              <Text style={styles.monthlyStatValue}>156</Text>
              <Text style={styles.monthlyStatLabel}>Ejercicios</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
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
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
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
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  streakCard: {
    backgroundColor: "#E8F5E8",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    marginBottom: 25,
  },
  medalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FDD835",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  medalEmoji: {
    fontSize: 30,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  streakLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  streakMessage: {
    fontSize: 14,
    color: "#7CB342",
    textAlign: "center",
    fontWeight: "500",
  },
  weekSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  dayContainer: {
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  dayCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    flex: 0.48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7CB342",
    borderRadius: 3,
  },
  achievementsSection: {
    marginBottom: 25,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementCard: {
    width: "48%",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  achievementDate: {
    fontSize: 12,
    color: "#666",
  },
  achievementTextLocked: {
    color: "#999",
  },
  monthlySummary: {
    backgroundColor: "#E8F5E8",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  monthlyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  monthlyStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  monthlyStatItem: {
    alignItems: "center",
  },
  monthlyStatValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7CB342",
    marginBottom: 5,
  },
  monthlyStatLabel: {
    fontSize: 14,
    color: "#666",
  },
})

export default Progreso
