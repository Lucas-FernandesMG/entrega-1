import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SensorDetail({ route, navigation }) {
  const { sensorName } = route.params;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [sensorName]);

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(
        `http://localhost:8080/api/readings/${encodeURIComponent(sensorName)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
        await AsyncStorage.removeItem('authToken');
        navigation.replace('Login');
        return;
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar histórico');
      }

      const data = await response.json();
      setHistory(data);
      Alert.alert('Sucesso', 'Dados atualizados!');
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico do sensor.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const getValueColor = (value) => {
    if (value > 70) return '#FF3B30';
    if (value > 50) return '#FF9500';
    return '#34C759';
  };

  const renderHistoryItem = ({ item, index }) => (
    <View style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyIndex}>#{history.length - index}</Text>
        <Text style={styles.historyDate}>
          {new Date(item.timestamp || item.createdAt).toLocaleString('pt-BR')}
        </Text>
      </View>
      <View style={styles.historyBody}>
        <Text style={styles.historyLabel}>Valor</Text>
        <Text style={[styles.historyValue, { color: getValueColor(item.sensorValue) }]}>
          {item.sensorValue.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando histórico...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{sensorName}</Text>
        <Text style={styles.subtitle}>Histórico de Leituras</Text>
      </View>

      {history.length > 0 && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Última Leitura</Text>
            <Text style={[styles.summaryValue, { color: getValueColor(history[0].sensorValue) }]}>
              {history[0].sensorValue.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total de Registros</Text>
            <Text style={styles.summaryValue}>{history.length}</Text>
          </View>
        </View>
      )}

      <FlatList
        data={history}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum histórico disponível</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.refreshButton} onPress={fetchHistory}>
        <Text style={styles.refreshButtonText}>Atualizar Dados</Text>
      </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  listContent: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyIndex: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
  historyBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLabel: {
    fontSize: 14,
    color: '#666',
  },
  historyValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});