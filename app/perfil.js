import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"

const Perfil = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>RehabBuddy</Text>
            <Text style={styles.headerSubtitle}>Centro de Rehabilitación San Juan</Text>
          </View>
          <View style={styles.avatarContainer}>
           
          </View>
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
              <Text style={styles.profileName}>María García</Text>
              <Text style={styles.profileEmail}>2022115@gmail.edu.mx</Text>
              <Text style={styles.memberSince}>📅 Miembro desde agosto de 2024</Text>
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

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logros Recientes</Text>
          <View style={styles.achievementsGrid}>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: "#FFF9C4" }]}>
                <Text style={styles.achievementEmoji}>☀️</Text>
              </View>
              <Text style={styles.achievementText}>Primera semana</Text>
            </View>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: "#FFE0B2" }]}>
                <Text style={styles.achievementEmoji}>🔥</Text>
              </View>
              <Text style={styles.achievementText}>7 días consecutivos</Text>
            </View>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: "#FFF9C4" }]}>
                <Text style={styles.achievementEmoji}>🏅</Text>
              </View>
              <Text style={styles.achievementText}>50 ejercicios</Text>
            </View>
            <View style={styles.achievementItem}>
              <View style={[styles.achievementIcon, { backgroundColor: "#F5F5F5" }]}>
                <Text style={styles.achievementEmoji}>👑</Text>
              </View>
              <Text style={[styles.achievementText, { color: "#999" }]}>Mes completo</Text>
            </View>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
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

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#FFF9C4" }]}>
                <Text style={styles.menuIconText}>🔔</Text>
              </View>
              <View>
                <Text style={styles.menuTitle}>Notificaciones</Text>
                <Text style={styles.menuSubtitle}>Configurar recordatorios y alertas</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#E3F2FD" }]}>
                <Text style={styles.menuIconText}>🛡️</Text>
              </View>
              <View>
                <Text style={styles.menuTitle}>Privacidad y Seguridad</Text>
                <Text style={styles.menuSubtitle}>Gestiona tu privacidad</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#F3E5F5" }]}>
                <Text style={styles.menuIconText}>⚙️</Text>
              </View>
              <View>
                <Text style={styles.menuTitle}>Configuración</Text>
                <Text style={styles.menuSubtitle}>Preferencias de la aplicación</Text>
              </View>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: "#E8F5E8" }]}>
                <Text style={styles.menuIconText}>❓</Text>
              </View>
              <View>
                <Text style={styles.menuTitle}>Ayuda y Soporte</Text>
                <Text style={styles.menuSubtitle}>Obtén ayuda o contacta soporte</Text>
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
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>🔓 Cerrar Sesión</Text>
        </TouchableOpacity>
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
  memberSince: {
    fontSize: 12,
    color: "#666",
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 15,
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementText: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
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
})

export default Perfil
