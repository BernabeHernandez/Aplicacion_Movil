import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const CATEGORIAS = [
  { nombre: "Motivación", key: "motivacion", color: "categoryGreen", icon: "💪", tips: "3 tips" },
  { nombre: "Ejercicios", key: "ejercicio", color: "categoryGreen", icon: "🏃", tips: "4 tips" },
  { nombre: "Nutrición", key: "nutricion", color: "categoryGreen", icon: "🥗", tips: "5 tips" },
  { nombre: "Descanso", key: "descanso", color: "categoryBlue", icon: "😴", tips: "4 tips" },
];

const { width } = Dimensions.get("window");

const Tips = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaTips, setCategoriaTips] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loadingCategoria, setLoadingCategoria] = useState(false);
  const handleCategoriaPress = async (categoria) => {
    setCategoriaSeleccionada(categoria);
    setLoadingCategoria(true);
    setModalVisible(true);
    try {
      const res = await fetch(`https://backendcentro.onrender.com/api/categoria-tips/${categoria.key}`);
      const data = await res.json();
      setCategoriaTips(data.tips || []);
    } catch (e) {
      setCategoriaTips([]);
    }
    setLoadingCategoria(false);
  };

 useEffect(() => {
  const fetchNotificaciones = () => {
    fetch("https://backendcentro.onrender.com/api/notificaciones/recientes")
      .then(res => res.json())
      .then(data => {
        setNotificaciones(data.notificaciones || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  fetchNotificaciones();

  const interval = setInterval(fetchNotificaciones, 60000); // Cada minuto PRUEBAS

  return () => clearInterval(interval);
}, []);

  const notificacionActual = notificaciones[0];

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

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Tips y Motivación</Text>
        <Text style={styles.subtitle}>Consejos diarios para tu bienestar</Text>
      </View>

      {/* Featured Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://i.pinimg.com/564x/6f/7d/cc/6f7dcc030b56fc2d02ceb30d8806d306.jpg",
          }}
          style={styles.featuredImage}
          resizeMode="cover"
        />
      </View>

      {/* Daily Motivation Card - Notificación actual */}
      <View style={styles.motivationCard}>
        {loading ? (
          <ActivityIndicator style={{ marginVertical: 20 }} />
        ) : notificacionActual ? (
          <>
            <View style={styles.motivationHeader}>
              <View style={styles.motivationIcon}>
                <Text style={styles.bulbIcon}>💡</Text>
              </View>
              <Text style={styles.motivationDate}>
                {new Date(notificacionActual.fecha_envio).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.motivationTitle}>{notificacionActual.titulo}</Text>
            <Text style={styles.motivationText}>{notificacionActual.mensaje}</Text>
            <View style={styles.motivationActions}>
          
              <TouchableOpacity style={styles.bookmarkButton}>
                <Text style={styles.bookmarkIcon}>🔖</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.motivationTitle}>Sin notificaciones recientes</Text>
        )}
      </View>

      {/* Categories Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categorías</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIAS.map((cat, idx) => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryCard, styles[cat.color]]}
              onPress={() => handleCategoriaPress(cat)}
            >
              <Text style={styles.categoryTitle}>{cat.nombre}</Text>
              <Text style={styles.categoryCount}>{cat.tips}</Text>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>{cat.icon}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      {/* Modal para mostrar tips de la categoría seleccionada */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '85%', maxHeight: '80%' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
              {categoriaSeleccionada ? categoriaSeleccionada.nombre : ''} - Tips
            </Text>
            {loadingCategoria ? (
              <ActivityIndicator style={{ marginVertical: 20 }} />
            ) : categoriaTips.length > 0 ? (
              <ScrollView style={{ maxHeight: 350 }}>
                {categoriaTips.map((tip) => (
                  <View key={tip.id_notificacion} style={{ marginBottom: 18, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{tip.titulo}</Text>
                    <Text style={{ color: '#555', marginTop: 2 }}>{tip.mensaje}</Text>
                    <Text style={{ color: '#999', fontSize: 12, marginTop: 2 }}>{new Date(tip.fecha_envio).toLocaleDateString()}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={{ textAlign: 'center', color: '#888', marginVertical: 20 }}>No hay tips en esta categoría.</Text>
            )}
            <Pressable
              style={{ marginTop: 15, backgroundColor: '#007AFF', borderRadius: 8, padding: 10 }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      </View>

      {/* Recent Tips Section */}
          <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tips Recientes</Text>
        </View>

        <View style={styles.tipsList}>
          {notificaciones.slice(1).map((tip, idx) => (
            <TouchableOpacity style={styles.tipItem} key={idx}>
              <View style={styles.tipIcon}>
                <Text style={styles.tipIconText}>💡</Text>
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.titulo}</Text>
                <Text style={styles.tipSubtitle}>{tip.mensaje}</Text>
              </View>
              <View style={styles.tipMeta}>
                <Text style={styles.tipDate}>
                  {new Date(tip.fecha_envio).toLocaleDateString()}
                </Text>
                <Text style={styles.tipBookmark}>🔖</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Motivational Quote */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          El éxito en la rehabilitación no se mide por la velocidad, sino por la constancia
        </Text>
        <Text style={styles.quoteAuthor}>- Centro de Rehabilitación San Juan</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
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
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    color: "white",
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  imageContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuredImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  motivationCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  motivationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  motivationIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF59D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  bulbIcon: {
    fontSize: 16,
  },
  motivationDate: {
    fontSize: 14,
    color: "#666",
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  motivationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 15,
  },
  motivationActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  heartIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  shareIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  actionText: {
    fontSize: 14,
    color: "#666",
  },
  bookmarkButton: {
    marginLeft: "auto",
  },
  bookmarkIcon: {
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#7CB342",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: (width - 50) / 2,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryGreen: {
    borderLeftWidth: 4,
    borderLeftColor: "#7CB342",
  },
  categoryBlue: {
    borderLeftWidth: 4,
    borderLeftColor: "#42A5F5",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  categoryCount: {
    fontSize: 14,
    color: "#666",
  },
  categoryIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  categoryIconText: {
    fontSize: 20,
  },
  tipsList: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  tipIconText: {
    fontSize: 18,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  tipSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
  },
  tipMeta: {
    alignItems: "flex-end",
  },
  tipDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 5,
  },
  tipBookmark: {
    fontSize: 16,
  },
  quoteCard: {
    backgroundColor: "#E8F5E8",
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#333",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 10,
  },
  quoteAuthor: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
})

export default Tips
