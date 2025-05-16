import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import sensorHistory1 from '../../mock/sensorHistory.json';
import sensorHistory2 from '../../mock/sensorHistory2.json';

export default function SensorDetail({ route }) {
  const { sensorId } = route.params;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Simula fetch de histórico com base no sensorId
    if (sensorId === '1') {
      setHistory(sensorHistory1);
    } else if (sensorId === '2') {
      setHistory(sensorHistory2);
    } else {
      setHistory([]);
    }
  }, [sensorId]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={styles.title}>Histórico do Sensor {sensorId}</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text>{item.timestamp}: {item.value}</Text>
        )}
      />
      <Button title="Atualizar" onPress={() => {
        // Aqui você pode implementar uma lógica real de atualização
        alert('Dados atualizados!');
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, marginBottom: 12 }
});