import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function SensorList({ navigation }) {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/readings')
      .then(response => response.json())
      .then(data => setSensors(data))
      .catch(error => console.error(error));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('SensorDetail', { sensorName: item.sensorName })}
    >
      <Text style={styles.name}>{item.sensorName}</Text>
      <Text>Valor: {item.sensorValue}</Text>
      <Text>Horário: {item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={sensors}
        keyExtractor={item => item.id.toString()}
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