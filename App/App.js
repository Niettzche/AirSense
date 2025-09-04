import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import MapScreen from './screens/Map';
import Presentation from './screens/Presentation.jsx'
import Navbar from './components/Navbar';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <View style={styles.screenContainer}>
          <Stack.Navigator
            initialRouteName="Intro"
            screenOptions={{ headerShown: false, animation: 'none'}}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Intro" component={Presentation} />
          </Stack.Navigator>
        </View>

      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenContainer: { flex: 1},
});

