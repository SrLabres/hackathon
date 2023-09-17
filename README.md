
### 🏗️ Estrutura do Projeto

Este projeto utiliza uma estrutura de monorepo, consistindo em um backend construído com Node.js e um frontend desenvolvido com React.

### 🚀 Começando

1. **Instalação**

   No diretório raiz do projeto, execute:

   ```bash
   yarn install
   ```

2. **Configuração de Variáveis de Ambiente**

   - **Frontend**:

     No diretório de frontend, copie o arquivo `.env.example` e renomeie-o para `.env`. Em seguida, atualize o valor de `VITE_BACKEND_URL`:

     ```env
     VITE_BACKEND_URL=http://localhost:8000
     ```

   - **Backend**:

     No diretório de backend, copie o arquivo `.env.example` e renomeie-o para `.env`. Em seguida, atualize o valor de `MONGODB_CONNECTION_STRING`:

     ```env
     MONGODB_CONNECTION_STRING=coloque_sua_string_de_conexão_aqui
     ```

3. **Executando a Aplicação**

   - **Backend**:

     Para iniciar o servidor backend, execute:

     ```bash
     yarn start:backend
     ```

   - **Frontend**:

     Para iniciar o frontend, execute:

     ```bash
     yarn start:frontend
     ```

### 🔧 Tecnologias Utilizadas

- Backend: Node.js
- Frontend: React
- Banco de Dados: MongoDB
