# 🚀 Instruções de Configuração - Entrega 4

## ✅ Funcionalidades Implementadas

### Frontend (React Native)

1. **Tela de Login integrada com backend**
   - Autenticação JWT
   - Armazenamento seguro do token com AsyncStorage
   - Validação de credenciais
   - Redirecionamento automático

2. **Dashboard consolidado**
   - Múltiplos sensores exibidos em cards
   - Visualização de status (Normal/Alerta/Crítico)
   - Estatísticas em tempo real
   - Auto-refresh a cada 10 segundos
   - Pull-to-refresh

3. **Sistema de Mensagens**
   - Mensagens de sucesso em requisições bem-sucedidas
   - Mensagens de erro em falhas
   - Feedback visual para todas as ações

## 📦 Instalação

### 1. Instalar dependências do frontend

```bash
npm install
```

A nova dependência adicionada:
- `@react-native-async-storage/async-storage` - Para armazenar o token JWT

### 2. Configurar o Backend

Certifique-se de que o backend Java está rodando em `http://localhost:8080`

**Endpoints esperados:**
- `POST /auth/login` - Login (retorna token JWT)
- `GET /api/readings` - Lista todos os sensores (requer autenticação)
- `GET /api/readings/{sensorName}` - Histórico de um sensor específico (requer autenticação)

### 3. Iniciar a aplicação

```bash
npm start
```

## 🔐 Credenciais Padrão

Com base no backend Java típico:
- **Usuário:** `admin`
- **Senha:** `admin`

## 📱 Fluxo da Aplicação

1. **Splash Screen** → Verifica se usuário está autenticado
2. **Login Screen** → Se não autenticado, exibe tela de login
3. **Dashboard** → Após login, exibe dashboard com sensores
4. **Sensor Detail** → Ao clicar em um card, exibe histórico detalhado

## 🎨 Estrutura de Telas

### LoginScreen.js
- Formulário de login
- Validação de campos
- Integração com API de autenticação
- Armazenamento de token

### DashboardScreen.js
- Cards de sensores em grid 2 colunas
- Indicadores de status coloridos
- Estatísticas (total de sensores e alertas)
- Botão de logout
- Auto-refresh e pull-to-refresh

### SensorDetail.js
- Histórico completo de leituras
- Resumo com última leitura e total de registros
- Indicadores visuais de valores
- Atualização manual

## 🔧 Configurações Técnicas

### Autenticação JWT
- Token armazenado no AsyncStorage
- Header `Authorization: Bearer {token}` em todas as requisições protegidas
- Verificação de expiração de token (redireciona para login se 401)

### Mensagens de Feedback
- **Sucesso:** Alert verde para ações bem-sucedidas
- **Erro:** Alert vermelho para falhas
- **Info:** Alert azul para informações

### Sistema de Cores
- **Normal (< 50):** Verde `#34C759`
- **Alerta (50-70):** Laranja `#FF9500`
- **Crítico (> 70):** Vermelho `#FF3B30`

## 🧪 Testando

1. **Backend ativo:** Certifique-se de que o backend está rodando
2. **Login:** Use as credenciais padrão (admin/admin)
3. **Dashboard:** Verifique se os sensores são carregados
4. **Sensor Detail:** Clique em um sensor para ver o histórico
5. **Logout:** Teste o logout e login novamente

## 📂 Arquivos Criados/Modificados

### Novos Arquivos:
- `src/screens/LoginScreen.js` - Tela de login
- `src/screens/DashboardScreen.js` - Dashboard principal
- `src/utils/api.js` - Utilitários para requisições API

### Arquivos Modificados:
- `src/navigation/AppNavigator.js` - Adicionadas rotas Login e Dashboard
- `src/screens/SplashScreen.js` - Verificação de autenticação
- `src/screens/SensorDetail.js` - Melhorias com autenticação e mensagens
- `package.json` - AsyncStorage adicionado

## 🔄 Auto-refresh

O dashboard atualiza automaticamente a cada 10 segundos. Para ajustar:

```javascript
// Em DashboardScreen.js, linha ~30
const interval = setInterval(fetchSensors, 10000); // 10 segundos
```

## ⚠️ Observações Importantes

1. **Backend Java:** Certifique-se de que o CORS está habilitado no backend
2. **URL da API:** Ajuste em cada tela se necessário (padrão: `http://localhost:8080`)
3. **Token Expiration:** O app redireciona automaticamente para login se o token expirar
4. **Async Storage:** Funciona em iOS, Android e Web

## 🐛 Troubleshooting

### "Não foi possível conectar ao servidor"
- Verifique se o backend está rodando
- Confirme a URL correta (`http://localhost:8080`)

### "Token inválido"
- Faça logout e login novamente
- Verifique se o backend está gerando tokens válidos

### "Sessão expirada"
- Normal se o token JWT expirar
- Basta fazer login novamente

## 🎯 Próximos Passos (Sugestões)

- [ ] Adicionar gráficos de histórico
- [ ] Implementar notificações push para alertas
- [ ] Cache offline de dados
- [ ] Filtros e busca no dashboard
- [ ] Exportação de relatórios
