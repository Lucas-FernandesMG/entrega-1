import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Desafio Digital Twin</Text>
      <Button title="Começar" onPress={() => navigation.navigate('SensorList')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 150, height: 150, marginBottom: 20 },
  title: { fontSize: 22, marginBottom: 20 }
});