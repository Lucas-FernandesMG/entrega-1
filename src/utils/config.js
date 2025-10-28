// Configuração da API
export const API_CONFIG = {
  // Tente estas URLs em ordem até encontrar a que funciona
  baseURLs: [
    'http://localhost:8080',      // Backend local padrão
    'http://127.0.0.1:8080',       // Alternativa localhost
    'http://192.168.1.103:8080',   // IP da rede local (ajuste conforme necessário)
  ],
  
  endpoints: {
    login: '/auth/login',
    readings: '/api/readings',
    readingDetail: (sensorName) => `/api/readings/${encodeURIComponent(sensorName)}`,
  },
  
  timeout: 10000, // 10 segundos
};

// Função para testar qual URL está funcionando
export const testBackendConnection = async () => {
  for (const baseURL of API_CONFIG.baseURLs) {
    try {
      console.log(`Testando conexão com ${baseURL}...`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${baseURL}/auth/login`, {
        method: 'OPTIONS',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log(`✅ Conexão bem-sucedida com ${baseURL}`);
      return baseURL;
    } catch (error) {
      console.log(`❌ Falha ao conectar com ${baseURL}:`, error.message);
    }
  }
  
  console.error('❌ Nenhuma URL do backend está acessível');
  return null;
};

// URL base atual (será detectada automaticamente)
let currentBaseURL = API_CONFIG.baseURLs[0];

export const setBaseURL = (url) => {
  currentBaseURL = url;
  console.log('Base URL configurada para:', url);
};

export const getBaseURL = () => currentBaseURL;

export default API_CONFIG;
