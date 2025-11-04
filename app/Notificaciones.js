import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"

const Notificaciones = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "recordatorio",
      title: "Hora de tu rutina cervical",
      message: "Es momento de realizar tu estiramiento cervical básico",
      time: "14:30",
      date: "Hoy",
      read: false,
      icon: "⏰",
    },
  ])

  const markAsRead = (id) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const getNotificationStyle = (type) => {
    switch (type) {
      case "recordatorio":
        return { borderColor: "#FF9800", backgroundColor: "#FFF3E0" }
      case "logro":
        return { borderColor: "#4CAF50", backgroundColor: "#E8F5E8" }
      case "tip":
        return { borderColor: "#2196F3", backgroundColor: "#E3F2FD" }
      case "sistema":
        return { borderColor: "#9C27B0", backgroundColor: "#F3E5F5" }
      case "motivacion":
        return { borderColor: "#7CB342", backgroundColor: "#F1F8E9" }
      default:
        return { borderColor: "#E0E0E0", backgroundColor: "#F5F5F5" }
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>RehabBuddy</Text>
          <Text style={styles.headerSubtitle}>Centro de Rehabilitación San Juan</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Notificaciones</Text>
          <Text style={styles.subtitle}>Mantente al día con tus recordatorios y logros</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount} sin leer</Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
              <Text style={styles.markAllText}>Marcar todas como leídas</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notifications List */}
        <View style={styles.notificationsList}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
                getNotificationStyle(notification.type),
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationIcon}>
                  <Text style={styles.iconText}>{notification.icon}</Text>
                </View>
                <View style={styles.notificationInfo}>
                  <Text style={[styles.notificationTitle, !notification.read && styles.unreadTitle]}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                </View>
                {!notification.read && <View style={styles.unreadDot} />}
              </View>
              <View style={styles.notificationFooter}>
                <Text style={styles.notificationTime}>
                  {notification.date} • {notification.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No hay notificaciones</Text>
            <Text style={styles.emptyMessage}>Te notificaremos sobre recordatorios, logros y actualizaciones</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#7CB342",
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E2E2E",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  unreadBadge: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#7CB342",
  },
  unreadText: {
    fontSize: 14,
    color: "#7CB342",
    fontWeight: "600",
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markAllText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "600",
  },
  notificationsList: {
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadCard: {
    borderWidth: 2,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(124, 179, 66, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E2E2E",
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: "bold",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF5722",
    marginLeft: 8,
    marginTop: 4,
  },
  notificationFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  notificationTime: {
    fontSize: 12,
    color: "#999999",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E2E2E",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
})

export default Notificaciones
