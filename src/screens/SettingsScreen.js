import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>URL da API (simulado):</Text>
      <TextInput
        placeholder="http://localhost:3000/sensores"
        style={styles.input}
        editable={false}
        value="mock local"
      />
      <Text style={styles.obs}>Este app usa dados mockados de arquivos locais.</Text>
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
