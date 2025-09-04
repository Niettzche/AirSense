import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  Animated
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width - 40;
const screenHeight = Dimensions.get('window').height;

const newsData = [
  { id: '1', title: 'Contaminación baja hoy', image: 'https://media.istockphoto.com/id/1419410282/es/foto/silencioso-bosque-en-primavera-con-sol-brillante-hermoso.jpg?s=612x612&w=0&k=20&c=z4N2WMWPgLoFodupQc1ggtOlovEfzbCeK4E1fiv78cg=' },
  { id: '2', title: 'Consejos para mejorar aire interior', image: 'https://futurociudades.tec.mx/sites/g/files/vgjovo1811/files/contaminacion.jpg' },
  { id: '3', title: 'Estudio sobre PM2.5', image: 'https://source.unsplash.com/400x200/?city,smog' },
  { id: '4', title: 'Nuevas regulaciones ambientales', image: 'https://source.unsplash.com/400x200/?environment' },
];

function Home() {
  // ----- Animación de la gráfica -----
  const finalData = [50, 60, 55, 70, 65, 80, 75];
  const animated = useRef(new Animated.Value(0)).current;
  const [animatedData, setAnimatedData] = useState(finalData.map(() => 0));

  useEffect(() => {
    Animated.timing(animated, { toValue: 1, duration: 2000, useNativeDriver: false }).start();
    const listener = animated.addListener(({ value }) => {
      setAnimatedData(finalData.map(d => d * value));
    });
    return () => animated.removeListener(listener);
  }, []);

  const data = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{ data: animatedData, color: () => `rgba(255,255,255,1)`, strokeWidth: 2 }],
  };

  const chartConfig = {
    backgroundColor: '#2d572c',
    backgroundGradientFrom: '#2d572c',
    backgroundGradientTo: '#2d572c',
    decimalPlaces: 0,
    color: () => `rgba(255,255,255,1)`,
    labelColor: () => `rgba(255,255,255,1)`,
    propsForDots: { r: '4', strokeWidth: '2', stroke: '#fff' },
  };

  // ----- Carrusel de noticias con flechas -----
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0); // ancho visible de la lista (entre flechas)

  // Cuando cambia el índice, scroll a ese elemento
  useEffect(() => {
    if (!flatListRef.current || viewportWidth <= 0) return;
    try {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0 // al inicio
      });
    } catch {
      // fallback por si getItemLayout aún no está disponible
      flatListRef.current.scrollToOffset({
        offset: currentIndex * viewportWidth,
        animated: true,
      });
    }
  }, [currentIndex, viewportWidth]);

  const next = () => setCurrentIndex(i => Math.min(i + 1, newsData.length - 1));
  const prev = () => setCurrentIndex(i => Math.max(i - 1, 0));

  // Proveer layout fijo a FlatList para que scrollToIndex sea estable
  const getItemLayout = (_, index) => ({
    length: viewportWidth,
    offset: viewportWidth * index,
    index,
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con perfil e icono */}
      <View style={styles.welcome}>
        <View style={styles.topRow}>
          <Image
            source={{ uri: 'https://pbs.twimg.com/profile_images/378800000049640746/3aea57a92364c808ef5a8eda75ad352a_400x400.jpeg' }}
            style={styles.profilePic}
          />
          <TouchableOpacity onPress={() => alert('Abrir configuración')}>
            <Ionicons name="settings-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Bienvenido, Mario!</Text>
      </View>

      {/* Calidad del aire */}
      <View style={styles.airdata}>
        <Text style={styles.airdataTitle}>Calidad del aire</Text>
        <View style={styles.dataRow}>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>AQI</Text>
            <Text style={styles.dataValue}>78</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>PM2.5</Text>
            <Text style={styles.dataValue}>35 µg/m³</Text>
          </View>
          <View style={styles.dataCard}>
            <Text style={styles.dataLabel}>PM10</Text>
            <Text style={styles.dataValue}>50 µg/m³</Text>
          </View>
        </View>

        <LineChart
          data={data}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          style={{ borderRadius: 15, alignSelf: 'center', marginTop: 10 }}
          withShadow
          bezier
        />
      </View>

      {/* Noticias */}
      <View style={[styles.news, { height: screenHeight * 0.25 }]}>
        <Text style={styles.newsTitle}>Noticias</Text>

        <View style={styles.newsRow}>
          {/* Flecha izquierda */}
          <TouchableOpacity
            onPress={prev}
            disabled={currentIndex === 0}
            style={[styles.arrowButton, currentIndex === 0 && styles.arrowDisabled]}
          >
            <Ionicons name="chevron-back-circle" size={32} color={currentIndex === 0 ? '#9e9e9e' : '#2d572c'} />
          </TouchableOpacity>

          {/* Viewport del carrusel: medimos su ancho real */}
          <View
            style={styles.carouselViewport}
            onLayout={(e) => setViewportWidth(e.nativeEvent.layout.width)}
          >
            {/** Importante: solo renderizamos FlatList cuando ya conocemos el ancho */}
            {viewportWidth > 0 && (
              <FlatList
                ref={flatListRef}
                data={newsData}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                getItemLayout={getItemLayout}
                snapToInterval={viewportWidth}
                decelerationRate="fast"
                snapToAlignment="start"
                renderItem={({ item }) => (
                  <View style={[styles.newsCard, { width: viewportWidth }]}>
                    <Image source={{ uri: item.image }} style={styles.newsImage} />
                    <View style={styles.overlay}>
                      <Text style={styles.newsText}>{item.title}</Text>
                    </View>
                  </View>
                )}
              />
            )}
          </View>

          {/* Flecha derecha */}
          <TouchableOpacity
            onPress={next}
            disabled={currentIndex === newsData.length - 1}
            style={[
              styles.arrowButton,
              currentIndex === newsData.length - 1 && styles.arrowDisabled
            ]}
          >
            <Ionicons
              name="chevron-forward-circle"
              size={32}
              color={currentIndex === newsData.length - 1 ? '#9e9e9e' : '#2d572c'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // General
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Header
  welcome: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profilePic: { width: 40, height: 40, borderRadius: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 10 },

  // Calidad del aire
  airdata: {
    backgroundColor: '#2d572c',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    justifyContent: 'center',
    padding: 20,
  },
  airdataTitle: { color: '#fff', textAlign: 'left', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  dataCard: { alignItems: 'center', flex: 1 },
  dataLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  dataValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 4 },

  // Noticias
  news: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 0,
    overflow: 'hidden', // nada sale del contenedor
  },
  newsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, paddingHorizontal: 10 },

  newsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingBottom: 6,
  },
  arrowButton: { paddingHorizontal: 6 },
  arrowDisabled: { opacity: 0.4 },

  // Viewport del carrusel (área entre flechas)
  carouselViewport: {
    flex: 1,
    overflow: 'hidden', // evita desbordes laterales
  },

  // Tarjeta de noticia ocupa todo el viewport para paging exacto
  newsCard: {
    height: '100%',
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  newsImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8 },
  newsText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

export default Home;

