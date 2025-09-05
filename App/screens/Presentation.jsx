import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Image, 
  TouchableOpacity, 
  Animated 
} from 'react-native';

const { width, height } = Dimensions.get('window');
const airImage = require('../assets/AirSense.png');

function Presentation({ navigation }) {
  const [step, setStep] = useState(0);

  // Animaciones
  const imageAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;


const slides = [
  {
    title: "Bienvenido a AirSense",
    text: "AirSense te da la bienvenida y te invita a explorar cómo puedes monitorear la calidad del aire a tu alrededor de forma inmediata, recibiendo información confiable para cuidar tu salud y la de tu familia.",
    image: airImage,
  },
  {
    title: "Monitoreo en tiempo real",
    text: "Con AirSense puedes conocer al instante el estado del aire que respiras, incluyendo partículas como PM2.5 y PM10, así como gases contaminantes. Cada lectura te ayuda a comprender el impacto del entorno en tu bienestar y a actuar a tiempo.",
    image: { uri: "" },
  },
  {
    title: "Visualización y análisis",
    text: "Explora gráficos y mapas interactivos que muestran cómo varía la calidad del aire con el tiempo y en distintos lugares. AirSense te permite entender las tendencias, comparar periodos y observar cómo los cambios ambientales te afectan.",
    image: { uri: "https://source.unsplash.com/400x200/?charts,environment" },
  },
  {
    title: "Educación y recomendaciones",
    text: "Aprende sobre los contaminantes, sus fuentes y efectos en la salud, mientras recibes consejos prácticos para reducir tu exposición. AirSense combina información científica con recomendaciones que puedes aplicar en tu día a día.",
    image: { uri: "https://source.unsplash.com/400x200/?advice,environment" },
  },
  {
    title: "Alertas y personalización",
    text: "Configura tu perfil y recibe alertas adaptadas a tu ubicación y hábitos. AirSense te notifica cuando la calidad del aire es mala y te ofrece sugerencias para proteger tu salud de manera personalizada.",
    image: { uri: "https://source.unsplash.com/400x200/?profile,user" },
  },
];

  // Animar los elementos al cambiar de step
  useEffect(() => {
    imageAnim.setValue(0);
    titleAnim.setValue(0);
    textAnim.setValue(0);
    buttonAnim.setValue(0);

    Animated.stagger(150, [
      Animated.spring(imageAnim, { toValue: 1, useNativeDriver: true }),
      Animated.spring(titleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.spring(textAnim, { toValue: 1, useNativeDriver: true }),
      Animated.spring(buttonAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, [step]);

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      navigation.replace('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={slides[step].image} 
        style={[styles.image, { transform: [{ scale: imageAnim }] }]} 
        resizeMode="contain" 
      />

      <Animated.Text style={[styles.title, { transform: [{ scale: titleAnim }] }]}>
        {slides[step].title}
      </Animated.Text>

      <Animated.Text style={[styles.subtitle, { transform: [{ scale: textAnim }] }]}>
        {slides[step].text}
      </Animated.Text>

      <Animated.View style={{ transform: [{ scale: buttonAnim }], marginTop: 40 }}>
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {step === slides.length - 1 ? "Empezar" : "OK"}
          </Text>
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
    paddingHorizontal: 30,
  },
  image: {
    width: width * 0.6,
    height: height * 0.3,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d572c',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    lineHeight: 22,
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

