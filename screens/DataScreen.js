import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Switch } from "react-native";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

const options = {
  host: '192.168.100.11',
  port: 8083,
  path: '/mqtt',
  id: 'id_' + parseInt(Math.random() * 100000),
};

const client = new Paho.MQTT.Client(options.host, options.port, options.path);

const publishToBateria = (message) => {
  const payload = message.toString();
  const topic = 'bateria';

  const mqttMessage = new Paho.MQTT.Message(payload);
  mqttMessage.destinationName = topic;

  client.send(mqttMessage);
};

export default function App() {
  const [status, setStatus] = useState('');
  const [subscribedTopics, setSubscribedTopics] = useState(['temperatura', 'voltaje', 'intensidad', 'distancia']);
  const [topicData, setTopicData] = useState({});
  const [bateriaHabilitada, setBateriaHabilitada] = useState(true); // Cambiado a true
  const [mensaje, setMensaje] = useState('');
  const [colorTexto, setColorTexto] = useState('#c00'); // Inicialmente rojo
  const [mensajeBateria, setMensajeBateria] = useState('Batería desactivada');

  useEffect(() => {
    connect();
    return () => {
      client.disconnect();
    };
  }, []);

  const onConnect = () => {
    setStatus('conectado');
    subscribedTopics.forEach((topic) => subscribeTopic(topic));
  };

  const onFailure = (err) => {
    setStatus('error de coneccion');
  };

  const connect = () => {
    setStatus('isFetching');
    client.connect({
      onSuccess: onConnect,
      useSSL: false,
      timeout: 3,
      onFailure: onFailure,
      userName: 'prueba',
      password: '1234',
      cleanSession: true,
    });
  };

  const subscribeTopic = (topic) => {
    client.subscribe(topic, { qos: 0 });
  };

  const onMessageArrived = (message) => {
    setTopicData((prevData) => ({
      ...prevData,
      [message.destinationName]: message.payloadString,
    }));
  };

  client.onMessageArrived = onMessageArrived;

  const toggleEstadoBateria = (value) => {
    setBateriaHabilitada(value);
    if (!value) { // Cambiado a !value
      publishToBateria('2'); // Cambiado a '2'
      setMensajeBateria('Batería desactivada'); // Cambiado a 'Batería activada'
    } else {
      publishToBateria('1'); // Cambiado a '1'
      setMensajeBateria('Batería activada'); // Cambiado a 'Batería desactivada'
    }
  };

  useEffect(() => {
    const temperaturaNumerica = parseFloat(topicData['temperatura']);
    if (temperaturaNumerica > 30) {
      setMensaje('La temperatura de la batería es muy alta.');
      setColorTexto('#c00'); // Rojo
    } else {
      setMensaje('La temperatura de la batería es normal.');
      setColorTexto('#0c0'); // Verde
    }
  }, [topicData]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/panel.png')} style={styles.image} />
      <Text style={styles.statusText}>Estado: {status}</Text>
      {subscribedTopics.map((topic) => (
        <Text style={styles.topicText} key={topic}>
          {topic}: {topicData[topic] || 'No data'}
        </Text>
      ))}
      <Text style={[styles.alerta, { color: colorTexto }]}>{mensaje}</Text>
      <View style={styles.switchContainer}>
        <Switch
          value={bateriaHabilitada}
          onValueChange={toggleEstadoBateria}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={bateriaHabilitada ? '#f5dd4b' : '#f4f3f4'}
        />
        <Text style={{ color: bateriaHabilitada ? '#0c0' : '#c00' }}>{mensajeBateria}</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  topicText: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    marginBottom: 45,
  },
  alerta: {
    marginTop: 20,
    fontFamily: 'Roboto',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
