import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import init from 'react_native_mqtt';


init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

const options = {
  host: '192.168.1.2',
  port: 8083,
  path: '/mqtt',
  id: 'id_' + parseInt(Math.random() * 100000),
};

const client = new Paho.MQTT.Client(options.host, options.port, options.path);

export default function App() {
  const [status, setStatus] = useState('');
  const [subscribedTopics, setSubscribedTopics] = useState(['temperatura', 'voltaje', 'intensidad', 'distancia']);
  const [topicData, setTopicData] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // Asegúrate de tener esta línea
  const [error, setError] = useState('');

  useEffect(() => {
    // Conectar cuando el componente se monta
    connect();

    // Limpiar la conexión cuando el componente se desmonta
    return () => {
      client.disconnect();
    };
  }, []);

  const onConnect = () => {
    console.log('onConnect');
    setStatus('connected');
    setLoggedIn(false);
    setError('');
    subscribedTopics.forEach((topic) => subscribeTopic(topic));
  };

  const onConnectionLost = (responseObject) => {
    console.log('Connection lost:', responseObject.errorMessage);
    setStatus('disconnected');
    setIsConnected(false);
  };

  const onFailure = (err) => {
    console.log('Connect failed!');
    console.log(err);
    setStatus('failed');
  };

  const connect = () => {
    setStatus('isFetching');
    client.connect({
      onSuccess: onConnect,
      useSSL: false,
      timeout: 3,
      onFailure: onFailure,
      userName: 'Cliente',
      password: '12345',
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


  client.onMessageArrived = onMessageArrived;

  const handleLogin = async () => {
    try {
      if (username === 'Admin' && password === '12345') {
        setLoggedIn(true);
        setError('');
      } else {
        setLoggedIn(false);
        setError('Usuario no registrado');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
  };


  return (
    <View style={styles.container}>
      
    {isLoggedIn ? (
      <View style={styles.loggedInContainer}>
        <Text style={styles.loggedInTitle}>Bienvenido</Text>
        <Text>Status: {status}</Text>
        <Text>Topic Data:</Text>
        {subscribedTopics.map((topic) => (
          <Text key={topic}>
            {topic}: {topicData[topic] || 'No data'}
          </Text>
        ))}
        <Button title="Salir" onPress={handleLogout} style={styles.salirButton} />
        <StatusBar style="auto" />
      </View>
    ) : (
      <View style={styles.loginContainer}>
        <Image
      source={require('./assets/img/imagen5.png')}
      style={styles.image}
    />
        <Text style={styles.loginTitle}>Inicio de Sesión</Text>
        <TextInput
          placeholder="Nombre de Usuario"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={styles.input}
        />
        <Button title="Iniciar Sesión" onPress={handleLogin} style={styles.loginButton} />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    )}
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
  loggedInContainer: {
    alignItems: 'center',
  },
  loggedInTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  salirButton: {
    backgroundColor: 'red',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  loginContainer: {
    width: '80%',
    alignItems: 'center',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },

  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain', // Puedes ajustar esto según tus necesidades
  },
});