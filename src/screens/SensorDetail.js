import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

export default function SensorDetail({ route }) {
  const { sensorName } = route.params;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/readings/${encodeURIComponent(sensorName)}`)
      .then(res => res.json())
      .then(setHistory)
      .catch(err => console.error(err));
  }, [sensorName]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Histórico do Sensor: {sensorName}</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.timestamp}: {item.sensorValue}</Text>
        )}
      />
      <Button title="Atualizar" onPress={() => {
        fetch(`http://localhost:8080/api/readings/${encodeURIComponent(sensorName)}`)
          .then(res => res.json())
          .then(setHistory)
          .catch(err => console.error(err));
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, marginBottom: 12 }
});