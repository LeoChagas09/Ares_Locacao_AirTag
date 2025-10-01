# Sistema de Locação de AirTags

API RESTful para gerenciamento de locação de dispositivos AirTags. O sistema oferece funcionalidades completas para cadastro de clientes, controle de dispositivos e gestão do ciclo de locação, incluindo cálculo automático de custos baseado no tempo de uso.

## Stack Tecnológica

- **Node.js** com **TypeScript** para desenvolvimento backend
- **Express.js** como framework web
- **Prisma** como ORM para gerenciamento de dados
- **PostgreSQL** como banco de dados relacional

## Arquitetura e Design

O projeto implementa uma arquitetura em camadas que promove separação de responsabilidades e facilita manutenção:

**Estrutura de Camadas:**
- **Routes:** Definição de endpoints e roteamento
- **Controllers:** Manipulação de requisições HTTP e formatação de respostas
- **Services:** Implementação da lógica de negócio
- **Database:** Camada de acesso a dados via Prisma

**Características Técnicas:**
- Utilização de UUIDs como identificadores primários para maior segurança
- Injeção de dependências nos services para facilitar testes
- Padronização de estrutura CRUD para consistência do código

## Requisitos

- [Node.js](https://nodejs.org/en/) v20 ou superior
- [PostgreSQL](https://www.postgresql.org/download/)
- npm

## Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/teste_ares"
PORT=3000
```

### 4. Execute as migrações
```bash
npx prisma migrate dev
```

### 5. Inicie o servidor
```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`

## Documentação da API

### Clientes (`/clientes`)

| Método HTTP | Endpoint        | Descrição                  | Exemplo de Corpo (Body)                           |
| :---------- | :-------------- | :------------------------- | :----------------------------------------------- |
| `POST`      | `/`             | Cria um novo cliente.      | `{ "nome": "João Silva", "email": "joao@email.com" }` |
| `GET`       | `/`             | Lista todos os clientes.   | -                                                |
| `GET`       | `/:id`          | Busca um cliente por ID.   | -                                                |
| `PUT`       | `/:id`          | Atualiza um cliente por ID.| `{ "nome": "João da Silva", "email": "joao.s@email.com" }` |
| `DELETE`    | `/:id`          | Deleta um cliente por ID.  | -                                                |

### Dispositivos (`/dispositivos`)

| Método HTTP | Endpoint        | Descrição                     | Exemplo de Corpo (Body)                           |
| :---------- | :-------------- | :---------------------------- | :------------------------------------------------ |
| `POST`      | `/`             | Cria um novo dispositivo.     | `{ "nome": "AirTag Chave", "macAddress": "A1:B2:C3:D4:E5:F6" }` |
| `GET`       | `/`             | Lista todos os dispositivos.  | -                                                 |
| `GET`       | `/:id`          | Busca um dispositivo por ID.  | -                                                 |
| `PUT`       | `/:id`          | Atualiza um dispositivo por ID.| `{ "nome": "AirTag Mochila", "macAddress": "A1:B2:C3:D4:E5:F7" }` |
| `DELETE`    | `/:id`          | Deleta um dispositivo por ID. | -                                                 |

### Locações (`/locacoes`)

| Método HTTP | Endpoint            | Descrição                                 | Exemplo de Corpo (Body)                                     |
| :---------- | :------------------ | :---------------------------------------- | :---------------------------------------------------------- |
| `POST`      | `/`                 | Inicia uma nova locação.                  | `{ "clienteId": "...", "dispositivoId": "..." }`           |
| `PATCH`     | `/:id/finalizar`    | Finaliza uma locação e calcula o custo.   | -                                                           |

---

## Contribuição

Este projeto foi desenvolvido seguindo boas práticas de desenvolvimento e está aberto para melhorias e sugestões.