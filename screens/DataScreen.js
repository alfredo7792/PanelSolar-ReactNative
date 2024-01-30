import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from "react-native";
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
  host: '192.168.100.11', //PONEN EL IP DE SU PC
  port: 8083,
  path: '/mqtt',
  id: 'id_' + parseInt(Math.random() * 100000),
};

const client = new Paho.MQTT.Client(options.host, options.port, options.path);

export default function App() {
  const [status, setStatus] = useState('');
  const [subscribedTopics, setSubscribedTopics] = useState(['temperatura', 'voltaje', 'intensidad', 'distancia']);
  const [topicData, setTopicData] = useState({});

  useEffect(() => {
    connect();
    return () => {
      // Cleanup: disconnect when component unmounts
      client.disconnect();
    };
  }, []);

  const onConnect = () => {
    console.log('onConnect');
    setStatus('conectado');
    // Subscribe to all specified topics
    subscribedTopics.forEach((topic) => subscribeTopic(topic));
  };

  const onFailure = (err) => {
    console.log('Connect failed!');
    console.log(err);
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

  const unSubscribeTopic = (topic) => {
    client.unsubscribe(topic);
  };

  const onMessageArrived = (message) => {
    console.log(`onMessageArrived (${message.destinationName}): ${message.payloadString}`);
    // Update the state with the received data
    setTopicData((prevData) => ({
      ...prevData,
      [message.destinationName]: message.payloadString,
    }));
  };

  // Set up message arrived callback
  client.onMessageArrived = onMessageArrived;

  return (
    <View style={styles.container}>
    <Image source={require('../assets/panel.png')} style={styles.image} />
      <Text style={styles.statusText}>Estado: {status}</Text>
      {subscribedTopics.map((topic) => (
        <Text style={styles.topicText} key={topic}>
          {topic}: {topicData[topic] || 'No data'}
        </Text>
      ))}
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
  });