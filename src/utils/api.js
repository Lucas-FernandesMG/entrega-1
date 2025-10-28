import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const API_BASE_URL = 'http://localhost:8080';

export const api = {
  async request(endpoint, options = {}) {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token && !options.skipAuth) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Erro na requisição',
          data,
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao conectar com o servidor',
        status: error.status,
      };
    }
  },

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};

export const showSuccessMessage = (title, message) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const showErrorMessage = (title, message) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};
