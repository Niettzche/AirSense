import React, { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, Animated } from 'react-native';

const { width, height } = Dimensions.get('window');
const airImage = require('../assets/AirSense.png'); // ajusta la ruta

function Presentation({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Animación pop-up
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 250, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      navigation.replace('Home'); // navegar a Home después de la animación
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a AirSense</Text>

      <Image
        source={airImage}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Botón OK con animación */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', 
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: 'black',  
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  image: {
    width: width * 0.4,
    height: height * 0.2,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2d572c', 
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Presentation;

