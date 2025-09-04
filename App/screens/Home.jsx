
import React, { useRef, useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx'
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

export default function Home() {
  const finalData = [50, 60, 55, 70, 65, 80, 75];

  // ----- Animación de la gráfica -----
  const animatedChart = useRef(new Animated.Value(0)).current;
  const [animatedData, setAnimatedData] = useState(finalData.map(() => 0));

  useEffect(() => {
    Animated.timing(animatedChart, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    const listener = animatedChart.addListener(({ value }) => {
      setAnimatedData(finalData.map(d => d * value));
    });

    return () => animatedChart.removeListener(listener);
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

  const flatListRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const getItemLayout = (_, index) => ({
    length: viewportWidth,
    offset: viewportWidth * index,
    index,
  });

  // Animación pop-up para los bloques
  const dataCardAnimations = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
  const newsAnimations = useRef(newsData.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Animar data cards
    Animated.stagger(150, dataCardAnimations.map(anim => Animated.spring(anim, { toValue: 1, useNativeDriver: true, bounciness: 10 }))).start();
    // Animar noticias
    Animated.stagger(150, newsAnimations.map(anim => Animated.spring(anim, { toValue: 1, useNativeDriver: true, bounciness: 10 }))).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con perfil e icono de configuración */}
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
          {['AQI', 'PM2.5', 'PM10'].map((label, index) => (
            <Animated.View key={index} style={[styles.dataCard, { 
              opacity: dataCardAnimations[index],
              transform: [{ scale: dataCardAnimations[index] }]
            }]}>
              <Text style={styles.dataLabel}>{label}</Text>
              <Text style={styles.dataValue}>{label === 'AQI' ? 78 : label === 'PM2.5' ? 35 : 50} µg/m³</Text>
            </Animated.View>
          ))}
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

      {/* Carrusel Noticias */}
      <View
        style={[styles.news, { height: screenHeight * 0.25 }]}
        onLayout={(e) => setViewportWidth(e.nativeEvent.layout.width)}
      >
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
            renderItem={({ item, index }) => (
              <Animated.View style={[styles.newsCard, { width: viewportWidth, 
                opacity: newsAnimations[index],
                transform: [{ scale: newsAnimations[index] }]
              }]}>
                <Image source={{ uri: item.image }} style={styles.newsImage} />
                <View style={styles.overlay}>
                  <Text style={styles.newsText}>{item.title}</Text>
                </View>
              </Animated.View>
            )}
          />
        )}
      </View>
      <Navbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  welcome: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profilePic: { width: 40, height: 40, borderRadius: 20 },
  title: { fontSize: 25, fontWeight: 'bold', color: '#333', marginTop: 10 },
  airdata: {
    backgroundColor: '#2d572c',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    justifyContent: 'center',
    padding: 20,
  },
  airdataTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  dataCard: { alignItems: 'center', flex: 1 },
  dataLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  dataValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  news: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  newsCard: { height: '100%', backgroundColor: '#eee', overflow: 'hidden' },
  newsImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8 },
  newsText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});

