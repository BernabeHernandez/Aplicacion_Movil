import { View, Text, StyleSheet, ScrollView, Animated, Easing } from "react-native";
import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const Progreso = () => {
  const { id_usuario } = useContext(AuthContext);
  const [weekDays, setWeekDays] = useState([]);
  const [totalDiasCompletados, setTotalDiasCompletados] = useState(0);
  const [completadas, setCompletadas] = useState({ completadas: 0, total: 0 });
  const [asignaciones, setAsignaciones] = useState([]);
  const [fechasCompletadas, setFechasCompletadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0); // Para controlar refresco

  const API_BASE_URL = "https://backendcentro.onrender.com";

  const normalizeDate = (date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  // Generar los días de la semana según la fecha actual
  const generarDiasSemana = (fechasCompletadas) => {
    const dias = [
      { day: "Lun", number: 1, completed: false },
      { day: "Mar", number: 2, completed: false },
      { day: "Mié", number: 3, completed: false },
      { day: "Jue", number: 4, completed: false },
      { day: "Vie", number: 5, completed: false },
      { day: "Sáb", number: 6, completed: false },
      { day: "Dom", number: 7, completed: false },
    ];

    const today = normalizeDate(new Date());
    const inicioSemana = new Date(today);
    inicioSemana.setDate(today.getDate() - today.getDay() + 1);

    const fechasNormalizadas = fechasCompletadas.map((fecha) =>
      normalizeDate(fecha).toISOString().split("T")[0]
    );

    return dias.map((dia, index) => {
      const diaFecha = new Date(inicioSemana);
      diaFecha.setDate(inicioSemana.getDate() + index);
      const fechaString = diaFecha.toISOString().split("T")[0];
      const completado = fechasNormalizadas.includes(fechaString);
      return { ...dia, completed: completado, number: diaFecha.getDate() };
    });
  };

  // Calcular completadas y total de rutinas por día
  const calcularCompletadas = (asignaciones, progresos, fecha = new Date()) => {
    const fechaNormalizada = normalizeDate(fecha);
    const asignacionesDelDia = asignaciones.filter((a) => {
      const inicio = normalizeDate(a.fecha_inicio);
      const fin = a.fecha_fin ? normalizeDate(a.fecha_fin) : inicio;
      return fechaNormalizada >= inicio && fechaNormalizada <= fin;
    });

    const total = asignacionesDelDia.length;
    const completadas = asignacionesDelDia.filter((a) => {
      const pasosAsignacion = progresos.filter((p) => p.id_asignacion === a.id);
      return pasosAsignacion.length > 0 && pasosAsignacion.every((p) => p.estado === "completado");
    }).length;

    return { completadas, total };
  };

  // Animaciones para los tres puntos
  const bounceValue1 = useRef(new Animated.Value(0)).current;
  const bounceValue2 = useRef(new Animated.Value(0)).current;
  const bounceValue3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = (value, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
            delay: delay,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = startAnimation(bounceValue1, 0);
    const anim2 = startAnimation(bounceValue2, 200);
    const anim3 = startAnimation(bounceValue3, 400);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [bounceValue1, bounceValue2, bounceValue3]);

  const translateY1 = bounceValue1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });
  const translateY2 = bounceValue2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });
  const translateY3 = bounceValue3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  // Memoizar la función fetch para performance
  const fetchData = useCallback(async () => {
    if (!id_usuario) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;
    const MIN_FETCH_INTERVAL = 30000; // 30 segundos como mínimo entre refetchs

    // Si ya cargó recientemente, usa datos cached
    if (timeSinceLastFetch < MIN_FETCH_INTERVAL && asignaciones.length > 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const asignacionesRes = await axios.get(`${API_BASE_URL}/api/asignaciones_rutinas/usuario/${id_usuario}`);
      const asignacionesData = asignacionesRes.data;

      const progresosPromises = asignacionesData.map((a) =>
        axios.get(`${API_BASE_URL}/api/progresos/asignacion/${a.id}`)
      );
      const progresosResponses = await Promise.all(progresosPromises);
      const progresosData = progresosResponses.flatMap((res) => res.data);

      const fechasCompletadasRes = await axios.get(`${API_BASE_URL}/api/completaciones_diarias/usuario/${id_usuario}/fechas`);
      const fechasCompletadasData = fechasCompletadasRes.data;

      console.log("Fechas completadas recibidas:", fechasCompletadasData);

      setAsignaciones(asignacionesData);
      setFechasCompletadas(fechasCompletadasData);
      setTotalDiasCompletados(fechasCompletadasData.length);
      setWeekDays(generarDiasSemana(fechasCompletadasData));
      setCompletadas(calcularCompletadas(asignacionesData, progresosData));
      setLastFetchTime(now);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Si falla, sigue usando datos cached
      setLoading(false);
    }
  }, [id_usuario, asignaciones.length, lastFetchTime]);

  // Ejecutar fetch cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Opcional: useEffect inicial si necesitas algo al montar
  useEffect(() => {}, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.spinner}>
          <Animated.View style={[styles.dot, { transform: [{ translateY: translateY1 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: translateY2 }] }]} />
          <Animated.View style={[styles.dot, { transform: [{ translateY: translateY3 }] }]} />
        </View>
      </View>
    );
  }

  if (!id_usuario) {
    return <Text>Por favor, inicia sesión para ver tu progreso.</Text>;
  }

  // Calcular el total de asignaciones (todas las rutinas asignadas al usuario)
  const totalAsignaciones = asignaciones.length;

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

        {/* Total Days Card */}
        <View style={styles.streakCard}>
          <View style={styles.medalIcon}>
            <Text style={styles.medalEmoji}>🏆</Text>
          </View>
          <Text style={styles.streakNumber}>{totalDiasCompletados} días</Text>
          <Text style={styles.streakLabel}>Días completados</Text>
          <Text style={styles.streakMessage}>¡Sigue así con tu compromiso!</Text>
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
            <Text style={styles.statValue}>{completadas.completadas}/{completadas.total}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: completadas.total > 0 ? `${(completadas.completadas / completadas.total) * 100}%` : "0%" },
                ]}
              />
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statLabel}>Promedio diario</Text>
            </View>
            <Text style={styles.statValue}>{totalAsignaciones} rutinas</Text>
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
              <Text style={styles.monthlyStatLabel}>Tiempo en Min</Text>
            </View>
            <View style={styles.monthlyStatItem}>
              <Text style={styles.monthlyStatValue}>15</Text>
              <Text style={styles.monthlyStatLabel}>Ejercicios</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  spinner: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2196F3",
    marginHorizontal: 4,
  },
});

export default Progreso;