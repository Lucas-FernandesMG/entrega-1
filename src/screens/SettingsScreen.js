import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const apiUrl = 'http://localhost:8080/api/readings';

  return (
    <View style={styles.container}>
      <Text style={styles.label}>URL da API:</Text>
      <TextInput
        placeholder={apiUrl}
        style={styles.input}
        editable={false}
        value={apiUrl}
      />
      <Text style={styles.obs}>Este app utiliza dados reais do backend.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: 'bold', marginBottom: 8 },
  input: {
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12
  },
  obs: { fontSize: 12, color: '#888' }
});
