import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { testBackendConnection, setBaseURL, getBaseURL } from '../utils/config';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Verificando...');

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    console.log('🔍 Verificando conexão com o backend...');
    const workingURL = await testBackendConnection();
    
    if (workingURL) {
      setBaseURL(workingURL);
      setBackendStatus(`Conectado: ${workingURL}`);
      console.log('✅ Backend acessível em:', workingURL);
    } else {
      setBackendStatus('❌ Backend não acessível');
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível conectar ao backend.\n\n' +
        'Certifique-se de que o servidor Java está rodando em:\n' +
        '• http://localhost:8080\n\n' +
        'E que o CORS está configurado corretamente.'
      );
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha usuário e senha.');
      return;
    }

    setLoading(true);

    try {
      const baseURL = getBaseURL();
      const loginURL = `${baseURL}/auth/login`;
      
      console.log('=== TENTANDO LOGIN ===');
      console.log('Usuário:', username);
      console.log('URL:', loginURL);
      
      const response = await fetch(loginURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Status HTTP:', response.status);
      console.log('Status OK:', response.ok);
      
      let data;
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('Resposta JSON:', JSON.stringify(data, null, 2));
      } else {
        const text = await response.text();
        console.log('Resposta em texto:', text);
        Alert.alert('Erro', 'Resposta inesperada do servidor: ' + text);
        return;
      }

      if (response.ok) {
        // Tentar diferentes chaves possíveis para o token
        const token = data.token || data.accessToken || data.jwt || data.access_token;
        
        if (!token) {
          console.error('❌ Token não encontrado na resposta');
          console.error('Chaves disponíveis:', Object.keys(data));
          Alert.alert('Erro', 'Token não recebido. Chaves na resposta: ' + Object.keys(data).join(', '));
          return;
        }

        console.log('✅ Token encontrado:', token.substring(0, 20) + '...');
        
        // Armazenar token
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('username', username);
        
        console.log('✅ Token armazenado no AsyncStorage');
        
        // Navegar diretamente sem Alert
        console.log('🚀 Navegando para Dashboard...');
        navigation.replace('Dashboard');
        
      } else {
        console.error('❌ Erro HTTP:', response.status);
        console.error('Resposta:', data);
        Alert.alert(
          'Erro de Autenticação', 
          data.message || data.error || `Credenciais inválidas (Status: ${response.status})`
        );
      }
    } catch (error) {
      console.error('❌ ERRO FATAL:', error);
      console.error('Nome do erro:', error.name);
      console.error('Mensagem:', error.message);
      
      let errorMessage = 'Não foi possível conectar ao servidor.\n\n';
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage += '⚠️ ERRO DE CORS ou Backend Offline\n\n' +
                       'Possíveis causas:\n' +
                       '1. Backend não está rodando\n' +
                       '2. CORS não configurado no backend\n' +
                       '3. URL incorreta\n\n' +
                       'Soluções:\n' +
                       '• Verifique se o backend está em http://localhost:8080\n' +
                       '• Configure CORS no SecurityConfig.java\n' +
                       '• Adicione @CrossOrigin nos controllers';
      } else {
        errorMessage += `Detalhes: ${error.message}`;
      }
      
      Alert.alert('Erro de Conexão', errorMessage);
    } finally {
      setLoading(false);
      console.log('=== FIM DA TENTATIVA DE LOGIN ===');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Digital Twin</Text>
        <Text style={styles.subtitle}>Monitoramento de Sensores</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Usuário: admin / Senha: admin123
        </Text>

        <TouchableOpacity 
          style={styles.testButton} 
          onPress={checkBackendConnection}
        >
          <Text style={styles.testButtonText}>🔄 Testar Conexão</Text>
        </TouchableOpacity>

        <Text style={styles.status}>{backendStatus}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  testButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
  },
  testButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  status: {
    marginTop: 12,
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});
