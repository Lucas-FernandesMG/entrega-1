# Desafio Digital Twin - Frontend (Entrega 3)

## Integrantes

- Emerson Batista da Silva — RM: 96288  
- Leonardo Yukio Uliana Seno — RM: 550648  
- Eduardo Cicero dos Santos — RM: 551415  
- Lucas Fernandes Marabini Gaspar — RM: 98814

## Descrição
Este é o frontend do projeto Digital Twin. Ele consome dados do backend real via API REST, exibindo leituras de sensores e seus históricos de forma interativa.
---
## Como rodar

1. **Clone o repositório:**
   ```
   git clone https://github.com/Lucas-FernandesMG/entrega-1.git
   ```
2. **Entre na pasta do projeto:**
   ```
   cd entrega-1
   ```
3. **Instale as dependências:**
   ```
   npm install
   ```
   ou (se for React Native):
   ```
   yarn
   ```
4. **Inicie o frontend:**
   ```
   npm start
   ```
   ou, para React Native:
   ```
   expo start
   ```
5. **Certifique-se de que o backend está rodando em** `http://localhost:8080`.

---

## Configuração da URL da API

No menu de configurações do app, é possível ajustar a URL do backend (exemplo: `http://localhost:8080/api/readings`) para consumir dados reais.

---

## Funcionalidades

- Listagem de sensores, exibindo nome, valor e horário da leitura.
- Detalhes de cada sensor, mostrando o histórico das leituras.
- Botão para atualizar os dados em tempo real.
- Integração com o backend utilizando os campos: `sensorName`, `sensorValue`, `timestamp` e `id`.

---

## Exemplos de uso da API

### Listar sensores

```js
fetch('http://localhost:8080/api/readings')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Buscar histórico de um sensor específico

```js
fetch('http://localhost:8080/api/readings/Sensor%20de%20Temperatura%201')
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Prints de telas

Adicione aqui screenshots mostrando:
- Listagem de sensores funcionando
- Detalhe/histórico de um sensor
- Tela de configuração da URL da API

---

## Observações

- O frontend depende do backend estar ativo para funcionar corretamente.
- Certifique-se de que ambos estão rodando localmente na mesma máquina, ou ajuste a URL da API conforme necessário.
- Caso queira rodar em dispositivos físicos ou emuladores, pode ser necessário ajustar o IP da API para o endereço da sua máquina.


