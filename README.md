# 🏷️ Sistema de Gestão de Locação de AirTags - Ares

Sistema completo para gerenciamento de locação de dispositivos AirTag, desenvolvido com **Node.js/Express** no backend, **Next.js** no frontend e **PostgreSQL** como banco de dados.

## 📋 Sobre o Projeto

O **Ares** é um sistema de gestão desenvolvido para facilitar o controle de locação de dispositivos AirTag. O sistema permite:

- **Gestão de Clientes**: Cadastro, edição e listagem de clientes
- **Gestão de Dispositivos**: Controle de AirTags disponíveis com identificação por MAC Address
- **Gestão de Locações**: Controle completo do ciclo de vida das locações (início, fim, custos)
- **Dashboard Analítico**: Visão geral com estatísticas e métricas importantes

### 🛠️ Tecnologias Utilizadas

#### Backend
- **Node.js** com **TypeScript**
- **Express.js** para API REST
- **Prisma ORM** para manipulação do banco de dados
- **PostgreSQL** como banco de dados relacional
- **Zod** para validação de dados
- **CORS** para política de compartilhamento de recursos

#### Frontend
- **Next.js 15** (App Router)
- **React 19** com TypeScript
- **Material-UI (MUI)** para interface visual
- **React Hook Form** para gerenciamento de formulários
- **React Toastify** para notificações

#### Infraestrutura
- **Docker** e **Docker Compose** para containerização
- **PostgreSQL 13** em container
- **Volumes** para persistência de dados

## 🏗️ Arquitetura do Sistema

```
├── backend/                 # API REST (Node.js + Express)
│   ├── src/
│   │   ├── controllers/     # Controladores das rotas
│   │   ├── services/        # Lógica de negócio
│   │   ├── routes/          # Definição das rotas
│   │   ├── middleware/      # Middlewares (tratamento de erros)
│   │   ├── database/        # Configuração do Prisma
│   │   └── utils/           # Utilitários e validações
│   └── prisma/
│       ├── schema.prisma    # Schema do banco de dados
│       └── migrations/      # Migrações do banco
│
├── frontend/                # Interface (Next.js + React)
│   ├── src/
│   │   ├── app/             # Páginas (App Router)
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── services/        # Serviços de API
│   │   └── types/           # Tipos TypeScript
│   └── public/              # Arquivos estáticos
│
└── docker compose.yml       # Orquestração dos serviços
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Docker** e **Docker Compose** instalados
- **Git** para clonar o repositório

### 1. Clone o Repositório

```bash
git clone https://github.com/LeoChagas09/Ares_Locacao_AirTag.git
cd Ares_Locacao_AirTag
```

### 2. Execute com Docker Compose

O projeto está totalmente containerizado. Para executar todos os serviços:

```bash
# Construir e iniciar todos os serviços
docker compose up --build

# Ou em modo detached (background)
docker compose up -d --build
```

### 3. Aguarde a Inicialização

O Docker Compose irá:

1. **Criar o banco PostgreSQL** na porta `5432`
2. **Construir e iniciar o backend** na porta `3333`
   - Executar as migrações do Prisma automaticamente
   - Configurar a conexão com o banco
3. **Construir e iniciar o frontend** na porta `3000`
   - Conectar com a API do backend

### 4. Acesse o Sistema

- **Frontend (Interface)**: http://localhost:3000
- **Backend (API)**: http://localhost:3333
- **Banco de Dados**: localhost:5432
  - Usuário: `postgres`
  - Senha: `admin`
  - Banco: `teste_ares`

### Comandos Úteis

```bash
# Parar todos os serviços
docker compose down

# Parar e remover volumes (limpar dados)
docker compose down -v

# Ver logs de todos os serviços
docker compose logs

# Ver logs de um serviço específico
docker compose logs backend
docker compose logs frontend
docker compose logs db

# Executar comandos no container do backend
docker compose exec backend npm run dev

# Acessar o bash do container
docker compose exec backend bash
```

## 📊 Funcionalidades

### Dashboard Principal
- Visão geral com estatísticas dos módulos
- Contadores de clientes, dispositivos e locações
- Receita total das locações finalizadas
- Navegação rápida entre módulos

### Gestão de Clientes
- ✅ Cadastro de novos clientes
- ✅ Listagem com busca e filtros
- ✅ Edição de informações
- ✅ Validação de email único

### Gestão de Dispositivos
- ✅ Cadastro de AirTags
- ✅ Controle por MAC Address único
- ✅ Status de disponibilidade
- ✅ Histórico de locações

### Gestão de Locações
- ✅ Criação de novas locações
- ✅ Vinculação cliente-dispositivo
- ✅ Controle de período (início/fim)
- ✅ Cálculo automático de custos
- ✅ Relatórios de locações ativas/finalizadas

## 🗃️ Estrutura do Banco de Dados

### Modelo de Dados

```sql
-- Clientes
Cliente {
  id_cliente: String (PK)
  nome: String
  email: String (Unique)
  locacoes: Locacao[]
}

-- Dispositivos AirTag
Dispositivo {
  id_dispositivo: String (PK)
  nome: String
  macAddress: String (Unique)
  locacoes: Locacao[]
}

-- Locações (Relacionamento)
Locacao {
  id_locacao: String (PK)
  dataInicio: DateTime
  dataFim: DateTime? (Nullable)
  custoTotal: Float? (Nullable)
  clienteId: String (FK)
  dispositivoId: String (FK)
}
```

## 🔧 Desenvolvimento

### Executar em Modo de Desenvolvimento

Se você quiser desenvolver localmente sem Docker:

#### Backend
```bash
cd backend
npm install
cp .env.example .env  # Configure as variáveis de ambiente
npx prisma migrate dev
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Variáveis de Ambiente

#### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:admin@localhost:5432/teste_ares"
PORT=3333
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
```

### Scripts Disponíveis

#### Backend
- `npm run dev` - Modo desenvolvimento com hot reload
- `npm run build` - Build para produção
- `npm run start` - Executar versão buildada
- `npx prisma studio` - Interface visual do banco

#### Frontend
- `npm run dev` - Modo desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Executar versão buildada
- `npm run lint` - Verificar código

## 📈 API Endpoints

### Clientes
- `GET /clientes` - Listar todos os clientes
- `POST /clientes` - Criar novo cliente
- `PUT /clientes/:id` - Atualizar cliente
- `DELETE /clientes/:id` - Remover cliente

### Dispositivos
- `GET /dispositivos` - Listar todos os dispositivos
- `POST /dispositivos` - Criar novo dispositivo
- `PUT /dispositivos/:id` - Atualizar dispositivo
- `DELETE /dispositivos/:id` - Remover dispositivo

### Locações
- `GET /locacoes` - Listar todas as locações
- `POST /locacoes` - Criar nova locação
- `PUT /locacoes/:id` - Atualizar locação
- `DELETE /locacoes/:id` - Remover locação
- `PUT /locacoes/:id/finalizar` - Finalizar locação

## 🛡️ Tratamento de Erros

O sistema implementa tratamento robusto de erros:

- **Validação de dados** com Zod
- **Middleware de tratamento de erros** centralizado
- **Logs detalhados** para debugging
- **Respostas padronizadas** da API
- **Notificações visuais** no frontend

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request


## 👨‍💻 Desenvolvedores

- **Leonardo Chagas** - [@LeoChagas09](https://github.com/LeoChagas09)

---

**Ares - Sistema de Gestão de Locação de AirTags** 🏷️✨