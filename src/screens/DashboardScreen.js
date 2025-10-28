import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DashboardScreen({ navigation }) {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    checkAuth();
    loadUsername();
    fetchSensors();

    // Auto-refresh a cada 10 segundos
    const interval = setInterval(fetchSensors, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      navigation.replace('Login');
    }
  };

  const loadUsername = async () => {
    const user = await AsyncStorage.getItem('username');
    if (user) setUsername(user);
  };

  const fetchSensors = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch('http://localhost:8080/api/readings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
        await AsyncStorage.removeItem('authToken');
        navigation.replace('Login');
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar dados dos sensores');
      }

      const data = await response.json();
      setSensors(data);
    } catch (error) {
      console.error('Erro ao carregar sensores:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados dos sensores.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSensors();
  };

  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: async () => {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('username');
          navigation.replace('Login');
        },
      },
    ]);
  };

  const getSensorStatus = (value) => {
    if (value > 70) return { status: 'Crítico', color: '#FF3B30' };
    if (value > 50) return { status: 'Alerta', color: '#FF9500' };
    return { status: 'Normal', color: '#34C759' };
  };

  const renderSensorCard = ({ item }) => {
    const { status, color } = getSensorStatus(item.sensorValue);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('SensorDetail', { sensorName: item.sensorName })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.sensorName}>{item.sensorName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: color }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.valueLabel}>Valor Atual</Text>
          <Text style={[styles.valueText, { color }]}>{item.sensorValue.toFixed(2)}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp || item.createdAt).toLocaleString('pt-BR')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando sensores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Bem-vindo, {username}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{sensors.length}</Text>
          <Text style={styles.statLabel}>Sensores Ativos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {sensors.filter(s => s.sensorValue > 50).length}
          </Text>
          <Text style={styles.statLabel}>Em Alerta</Text>
        </View>
      </View>

      <FlatList
        data={sensors}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSensorCard}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum sensor encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sensorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardBody: {
    alignItems: 'center',
    marginVertical: 12,
  },
  valueLabel: {
    fontSize: 12,
    color: '#999',
  },
  valueText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
