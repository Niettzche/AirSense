import React, { useRef, useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Dimensions, SafeAreaView, FlatList, Image, TouchableOpacity, Animated 
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width - 40; 
const screenHeight = Dimensions.get('window').height; 

const newsData = [
  { id: '1', title: 'Contaminación baja hoy', image: 'https://source.unsplash.com/400x200/?nature,air' },
  { id: '2', title: 'Consejos para mejorar aire interior', image: 'https://source.unsplash.com/400x200/?home,plants' },
  { id: '3', title: 'Estudio sobre PM2.5', image: 'https://source.unsplash.com/400x200/?city,smog' },
  { id: '4', title: 'Nuevas regulaciones ambientales', image: 'https://source.unsplash.com/400x200/?environment' },
];

function Home() {
  const flatListRef = useRef(null);
  let currentIndex = 0;

  const finalData = [50, 60, 55, 70, 65, 80, 75];

  // Animated value
  const animated = useRef(new Animated.Value(0)).current;

  // Estado de datos animados
  const [animatedData, setAnimatedData] = useState(finalData.map(() => 0));

  useEffect(() => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 2000, // 2 segundos
      useNativeDriver: false,
    }).start();

    const listener = animated.addListener(({ value }) => {
      const newData = finalData.map(d => d * value);
      setAnimatedData(newData);
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

  const scrollNext = () => {
    if (currentIndex < newsData.length - 1) {
      currentIndex += 1;
      flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
    }
  };

  const scrollPrev = () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      flatListRef.current.scrollToIndex({ index: currentIndex, animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.welcome}>
        <Text style={styles.title}>Bienvenido, Mario!</Text>
      </View>

      <View style={styles.airdata}>
        <Text style={styles.airdataTitle}>Calidad del aire</Text>
        <View style={styles.dataRow}>
          <View style={styles.dataCard}><Text style={styles.dataLabel}>AQI</Text><Text style={styles.dataValue}>78</Text></View>
          <View style={styles.dataCard}><Text style={styles.dataLabel}>PM2.5</Text><Text style={styles.dataValue}>35 µg/m³</Text></View>
          <View style={styles.dataCard}><Text style={styles.dataLabel}>PM10</Text><Text style={styles.dataValue}>50 µg/m³</Text></View>
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

      <View style={[styles.news, { height: screenHeight * 0.25 }]}>
        <Text style={styles.newsTitle}>Noticias</Text>
        <View style={styles.newsContainer}>
          <TouchableOpacity onPress={scrollPrev} style={styles.arrowButton}>
            <Ionicons name="chevron-back-circle" size={32} color="#2d572c" />
          </TouchableOpacity>

          <FlatList
            ref={flatListRef}
            data={newsData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <View style={styles.newsCard}>
                <Image source={{ uri: item.image }} style={styles.newsImage} />
                <Text style={styles.newsText}>{item.title}</Text>
              </View>
            )}
          />

          <TouchableOpacity onPress={scrollNext} style={styles.arrowButton}>
            <Ionicons name="chevron-forward-circle" size={32} color="#2d572c" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    welcome: { justifyContent: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    airdata: { backgroundColor: '#2d572c', marginHorizontal: 20, marginVertical: 10, borderRadius: 15, justifyContent: 'center', padding: 20 },
    airdataTitle: { color: '#fff', textAlign: 'left', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    dataRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
    dataCard: { alignItems: 'center', flex: 1 },
    dataLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    dataValue: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 4 },
    news: { backgroundColor: '#fff', marginHorizontal: 20, marginVertical: 10, borderRadius: 15, paddingVertical: 10, paddingHorizontal: 0 },
    newsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, paddingHorizontal: 10 },
    newsContainer: { flexDirection: 'row', alignItems: 'center' },
    arrowButton: { paddingHorizontal: 5 },
    newsCard: { width: 270, marginRight: 15, overflow: 'hidden', backgroundColor: '#eee',padding: 10,borderRadius:10},
    newsImage: { width: '100%', height: 120, resizeMode: 'cover' },
    newsText: { padding: 5, fontSize: 14, fontWeight: 'bold', color: '#333' },
});

export default Home;

