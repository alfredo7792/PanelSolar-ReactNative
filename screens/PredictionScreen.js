import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from "react-native";

const HomeScreen = ({ setShowStatistics }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido(a) al panel principal</Text>
      <Text style={styles.subtitle}>Temperaturas segun la hora</Text>
      <Image source={require('../assets/grafica_prediccion.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#9b59b6',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 30,
    color: 'black',
  },
  image: {
    width: 500,
    height: 250,
    resizeMode: 'contain',
    marginTop: 10,
  },
});

export default HomeScreen;
