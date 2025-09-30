import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function ConfigScreen() {
  const [apiUrl, setApiUrl] = useState('http://localhost:8080/api/readings');

  return (
    <View style={styles.container}>
      <Text>Configuração da URL da API:</Text>
      <TextInput
        style={styles.input}
        value={apiUrl}
        onChangeText={setApiUrl}
        placeholder="Informe a URL da API"
      />
      <Button title="Salvar" onPress={() => alert(`URL salva: ${apiUrl}`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 12 }
});