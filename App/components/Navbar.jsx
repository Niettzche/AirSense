import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Navbar() {
  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.button}>
          <Icon name="home" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="chart-line" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Icon name="newspaper" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    position: 'absolute',
    bottom: 50, // separación del borde inferior
    left: 20,
    right: 20, // separación de los lados
    alignItems: 'center',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#2d572c', // verde pastel
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    justifyContent: 'space-around',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // para Android
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Navbar;

