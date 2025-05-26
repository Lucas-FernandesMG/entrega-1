import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import sensorsData from '../../mock/sensor.json';

export default function SensorList({ navigation }) {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    // Simula fetch local com mock
    setSensors(sensorsData);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('SensorDetail', { sensorId: item.id })}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text>Valor: {item.value}</Text>
      <Text>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={sensors}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#eee',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16
  }
});
