"use client"

import { useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const RutinaDetalle = () => {
  const route = useRoute()
  const { id_rutina } = route.params || {} // Obtener id_rutina de los parámetros de navegación

  const [currentExercise, setCurrentExercise] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [rutina, setRutina] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Mapear pasos a exercises usando la estructura normalizada
  const exercises = Array.isArray(rutina?.pasos)
    ? rutina.pasos.map((paso, index) => ({
        id: paso.id_paso || index + 1,
        title: paso.nombre || "Sin título",
        description: paso.descripcion || "Sin descripción",
        // tiempo_estimado viene en minutos, convertir a segundos si es un número válido
        duration: typeof paso.tiempo_estimado === 'number' && !isNaN(paso.tiempo_estimado)
          ? paso.tiempo_estimado * 60
          : 180,
        instructions: [], // Si tienes instrucciones adicionales, agrégalas aquí
        tips: [
          "Realiza los movimientos lentamente",
          "No fuerces si sientes dolor",
          "Respira profundamente",
        ],
        image: paso.imagen || null,
      }))
    : []

  const currentExerciseData = exercises[currentExercise] || {}
  const totalExercises = exercises.length
  // Si ya se completó el último paso, progreso 100%
  const isCompleted = currentExercise === totalExercises - 1 && !isRunning && !isPaused && timeRemaining === 0;
  const progress = totalExercises > 0
    ? isCompleted
      ? 100
      : ((currentExercise + (isRunning ? 0.5 : 0)) / totalExercises) * 100
    : 0;

  // Reiniciar rutina
  const handleRepeat = () => {
    setCurrentExercise(0);
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(exercises[0]?.duration || 0);
  };

  // Obtener datos de la rutina desde la API
  useEffect(() => {
    const fetchRutina = async () => {
      try {
        setLoading(true)
        console.log(`Fetching rutina with id ${id_rutina}`)
        const response = await fetch(`https://backendcentro.onrender.com/api/rutinas/${id_rutina}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        console.log(`Response status: ${response.status}`)
        if (!response.ok) {
          const errorText = await response.text()
          console.error(`API error: ${errorText}`)
          throw new Error(`Error al cargar la rutina: ${response.status} ${errorText}`)
        }
        const data = await response.json()
        console.log('API response:', data)
        setRutina(data)
        setLoading(false)
      } catch (err) {
        console.error('Fetch error:', err.message)
        setError(`Error al cargar la rutina: ${err.message}`)
        setLoading(false)
      }
    }

    if (id_rutina) {
      fetchRutina()
    } else {
      setError('No se proporcionó un ID de rutina')
      setLoading(false)
    }
  }, [id_rutina])

  // Solo reiniciar el temporizador cuando cambia el ejercicio
  useEffect(() => {
    if (currentExerciseData.duration) {
      setTimeRemaining(currentExerciseData.duration)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise])

  useEffect(() => {
    let interval = null
    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isRunning) {
      setIsRunning(false)
      if (currentExercise < totalExercises - 1) {
        setTimeout(() => {
          handleNext()
        }, 1000)
      }
    }
    return () => clearInterval(interval)
  }, [isRunning, isPaused, timeRemaining, currentExercise, totalExercises])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleComplete = () => {
    setIsRunning(false)
    setIsPaused(false)
    if (currentExercise < totalExercises - 1) {
      handleNext()
    }
    // Si es el último paso, no hacer nada más, la barra marcará 100%
  }

  const handleNext = () => {
    if (currentExercise < totalExercises - 1) {
      setCurrentExercise(currentExercise + 1)
      setIsRunning(false)
      setIsPaused(false)
    }
  }

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      setIsRunning(false)
      setIsPaused(false)
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Cargando rutina...</Text>
      </SafeAreaView>
    )
  }

  if (error || !rutina) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error || 'Rutina no encontrada'}</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#7CB342" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RehabBuddy</Text>
        <Text style={styles.headerSubtitle}>Centro de Rehabilitación San Juan</Text>
      </View>

      {/* Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.routineTitle}>{rutina.titulo || "Sin título"}</Text>
          <Text style={styles.exerciseCounter}>
            Ejercicio {currentExercise + 1} de {totalExercises}
          </Text>
        </View>
        <Text style={styles.difficulty}>Fácil</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Progreso</Text>
        <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Exercise Info (Mostrar todos los pasos) */}
        <View style={styles.exerciseInfo}>
          {exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.stepContainer}>
              <View style={styles.imageContainer}>
                {exercise.image ? (
                  <Image source={{ uri: exercise.image }} style={styles.stepImage} resizeMode="cover" />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imageIcon}>🖼️</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.exerciseTitle, index === currentExercise && styles.currentExerciseTitle]}>
                {exercise.title}
              </Text>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
            </View>
          ))}
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(isRunning ? timeRemaining : currentExerciseData.duration)}</Text>
          </View>
          <Text style={styles.timerLabel}>{isRunning ? "Tiempo restante" : "Duración del ejercicio"}</Text>
        </View>

        {/* Instructions */}
        {!isRunning && exercises.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Instrucciones:</Text>
            {currentExerciseData.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.instructionNumber}>
                  <Text style={styles.instructionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </>
        )}

        {/* Tips */}
        {!isRunning && exercises.length > 0 && (
          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsIcon}>💡</Text>
              <Text style={styles.tipsTitle}>Consejos:</Text>
            </View>
            {currentExerciseData.tips.map((tip, index) => (
              <Text key={index} style={styles.tipText}>
                • {tip}
              </Text>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {isCompleted ? (
            <TouchableOpacity style={styles.startButton} onPress={handleRepeat}>
              <Text style={styles.startButtonText}>↻ Repetir Ejercicio</Text>
            </TouchableOpacity>
          ) : !isRunning ? (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>▶ Comenzar Ejercicio</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.runningButtons}>
              <TouchableOpacity style={styles.pauseButton} onPress={isPaused ? handleStart : handlePause}>
                <Text style={styles.pauseButtonText}>{isPaused ? "▶ Reanudar" : "⏸ Pausar"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                <Text style={styles.completeButtonText}>✓ Completar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Navigation */}
        {/* Ocultar navegación si ya se completó la rutina */}
        {!isCompleted && (
          <View style={styles.navigation}>
            <TouchableOpacity
              style={[styles.navButton, currentExercise === 0 && styles.navButtonDisabled]}
              onPress={handlePrevious}
              disabled={currentExercise === 0}
            >
              <Text style={[styles.navButtonText, currentExercise === 0 && styles.navButtonTextDisabled]}>
                ↻ Anterior
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, currentExercise === totalExercises - 1 && styles.navButtonDisabled]}
              onPress={handleNext}
              disabled={currentExercise === totalExercises - 1}
            >
              <Text
                style={[styles.navButtonText, currentExercise === totalExercises - 1 && styles.navButtonTextDisabled]}
              >
                Siguiente ⤷
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#7CB342",
    paddingTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: "relative",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
  },
  avatar: {
    position: "absolute",
    right: 20,
    top: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
  },
  backButton: {
    marginRight: 15,
  },
  backArrow: {
    fontSize: 24,
    color: "#333",
  },
  titleContainer: {
    flex: 1,
  },
  routineTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  exerciseCounter: {
    fontSize: 14,
    color: "#7CB342",
    marginTop: 2,
  },
  difficulty: {
    backgroundColor: "#E8F5E8",
    color: "#7CB342",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "500",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: "white",
  },
  progressLabel: {
    fontSize: 16,
    color: "#333",
  },
  progressPercent: {
    fontSize: 16,
    color: "#7CB342",
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7CB342",
    borderRadius: 4,
  },
  content: {
    flex: 1,
  },
  exerciseInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  stepContainer: {
    marginBottom: 20,
  },
  imageContainer: {
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  stepImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  imageIcon: {
    fontSize: 48,
    color: "#999",
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  currentExerciseTitle: {
    color: "#7CB342", // Resaltar el ejercicio actual
  },
  exerciseDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginBottom: 10,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  timerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  timerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  timerLabel: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  instructionItem: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#7CB342",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  tipsContainer: {
    backgroundColor: "#FFF9C4",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FBC02D",
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tipsIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 4,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#7CB342",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  runningButtons: {
    flexDirection: "row",
    gap: 10,
  },
  pauseButton: {
    flex: 1,
    backgroundColor: "#F44336",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  pauseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  completeButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: "#7CB342",
    fontWeight: "500",
  },
  navButtonTextDisabled: {
    color: "#999",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginTop: 50,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 50,
  },
})

export default RutinaDetalle