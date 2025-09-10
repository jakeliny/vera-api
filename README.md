# V.E.R.A — Valor Efetivo de Renda Analisada

V.E.R.A é um acrônimo para **Valor Efetivo de Renda Analisada**, um serviço que processa a renda e o tempo de trabalho de um profissional para embasar análises de crédito. O projeto foi desenvolvido com foco em demonstrar **padrões de arquitetura limpa, flexibilidade de persistência e qualidade de código**, pilares essenciais em uma aplicação de back-end.

## Visão Geral do Projeto

Esta aplicação é uma API REST desenvolvida em **NestJS** que gerencia registros de funcionários, calculando automaticamente valores de salário e tempo de trabalho. O grande diferencial do projeto é a flexibilidade, permitindo alternar facilmente entre persistência em memória para desenvolvimento rápido e **MongoDB** para produção, utilizando uma arquitetura modular e aderente aos princípios **SOLID**.

## Stack Tecnológica

- **Backend**: Node.js, TypeScript, NestJS
- **Banco de Dados**: MongoDB (com Mongoose ODM)
- **Containerização**: Docker & Docker Compose
- **Persistência**: Padrão de Repositório com estratégia dupla (In-Memory / MongoDB)
- **Validação**: Esquemas Zod com decoradores customizados
- **Documentação da API**: Swagger/OpenAPI

## Arquitetura

A aplicação foi estruturada com base na arquitetura **Repository Pattern**, permitindo a abstração da camada de persistência. A injeção de dependência do NestJS facilita a alternância de repositórios, conforme ilustrado abaixo:

```
RegistrosService
↓
IRegistrosRepository (Interface)
↓
├─ InMemoryRegistrosRepository (Desenvolvimento)
└─ MongoRegistrosRepository (Produção)
```

### Injeção Baseada em Ambiente

```typescript
// Seleção automática de repositório baseada em USE_DATABASE
{
  provide: 'IRegistrosRepository',
  useFactory: (configService, inMemoryRepo, mongoRepo) => {
    const useDatabase = configService.get('USE_DATABASE') === 'true';
    return useDatabase ? mongoRepo : inMemoryRepo;
  },
  inject: [ConfigService, InMemoryRegistrosRepository, MongoRegistrosRepository],
}
```

## Pré-requisitos

- Node.js >= 18
- pnpm >= 8
- Docker & Docker Compose (para configuração com MongoDB)

---

## Instalação e Configuração

```bash
# Instalar dependências
pnpm install
```

### Variáveis de Ambiente

A aplicação suporta dois modos de persistência, controlados pela variável de ambiente `USE_DATABASE`.

Copie o arquivo `.env.example` na raiz do projeto e crie um arquivo `.env`:

```
NODE_ENV=
PORT=
USE_DATABASE=

MONGO_ROOT_USERNAME=
MONGO_ROOT_PASSWORD=
MONGO_DATABASE=
MONGODB_URI=
```

- `USE_DATABASE=false`: Utiliza o repositório em memória.

- `USE_DATABASE=true`: Utiliza o repositório MongoDB.

## Como Executar a Aplicação

### Opção 1: Desenvolvimento Local (In-Memory)

Ideal para desenvolvimento rápido e testes sem dependências externas.

```bash

# Garantir que USE_DATABASE=false no arquivo .env
echo "USE_DATABASE=false" >> .env

# Executar em modo desenvolvimento
pnpm start:dev
```

**Características:**

- Sem dependências externas.

- Inicialização rápida.

- Os dados não são persistidos, sendo reiniciados a cada `restart`.

### Opção 2: Configuração de Produção (MongoDB com Docker)

Recomendado para ambientes que necessitam de armazenamento persistente.

```bash

# Iniciar containers da aplicação e do banco de dados
pnpm dev:start

# Visualizar logs
pnpm dev:logs

# Parar os containers
pnpm dev:stop
```

**Características:**

- Armazenamento persistente de dados.
- Configuração pronta para ser replicada em produção.
- Conexão automática com o banco de dados.

---

## Scripts Principais

| Script            | Descrição                                        |
| :---------------- | :----------------------------------------------- |
| `pnpm dev:start`  | Inicia ambiente completo com Docker Compose      |
| `pnpm start:dev`  | Executa aplicação localmente (em memória)        |
| `pnpm start:prod` | Executa aplicação localmente em modo de produção |
| `pnpm test`       | Executa testes unitários                         |
| `pnpm test:cov`   | Executa testes com relatório de cobertura        |
| `pnpm test:e2e`   | Executa testes end-to-end                        |

---

## Documentação e Endpoints da API

Uma vez em execução, a documentação interativa da API está disponível no **Swagger UI**:

> http://localhost:3000/api

### Endpoints Principais

| Método | Endpoint         | Descrição                 |
| :----- | :--------------- | :------------------------ |
| POST   | `/registros`     | Criar um novo registro    |
| GET    | `/registros`     | Listar todos os registros |
| GET    | `/registros/:id` | Buscar um registro por ID |
| PUT    | `/registros/:id` | Atualizar um registro     |
| DELETE | `/registros/:id` | Deletar um registro       |

##Testes

### Execução de Testes

```bash
# Testes unitários
pnpm test

# Testes end-to-end
pnpm test:e2e

# Relatório de cobertura
pnpm test:cov

# Modo watch para desenvolvimento
pnpm test:watch
```

### Teste de Persistência de Dados

#### Testando Modo In-Memory

```bash
# 1. Garantir USE_DATABASE=false no .env
# 2. Iniciar a aplicação
pnpm start:dev

# 3. Criar um registro
curl -X POST http://localhost:3000/registros \
  -H "Content-Type: application/json" \
  -d '{"employee": "Test User", "admissionDate": "2024-01-01", "salary": 4000}'

# 4. Verificar se registro existe
curl -X GET http://localhost:3000/registros

# 5. Reiniciar aplicação (Ctrl+C e executar novamente)
# 6. Verificar registros (devem estar vazios - dados não persistidos)
curl -X GET http://localhost:3000/registros
```

#### Testando Persistência MongoDB

```bash
# 1. Iniciar com Docker Compose
pnpm dev:start

# 2. Criar um registro
curl -X POST http://localhost:3000/registros \
  -H "Content-Type: application/json" \
  -d '{"employee": "Persistent User", "admissionDate": "2024-01-01", "salary": 5500}'

# 3. Verificar se registro existe
curl -X GET http://localhost:3000/registros

# 4. Reiniciar containers
pnpm dev:restart

# 5. Verificar registros (devem ainda existir - dados persistidos no MongoDB)
curl -X GET http://localhost:3000/registros
```

## Qualidade do Código

```bash
# Verificar código
pnpm lint

# Formatar código
pnpm format

# Compilar aplicação
pnpm build
```

## Comandos Docker

### Gerenciamento da Aplicação

```bash
# Compilar e iniciar todos os serviços
pnpm dev:start

# Iniciar apenas serviço específico
docker-compose up mongodb

# Visualizar logs do serviço
pnpm dev:logs

# Executar comandos em container em execução
docker-compose exec app pnpm test

# Limpeza completa de volumes e redes
pnpm dev:stop --volumes --remove-orphans
```

### Gerenciamento do Banco de Dados

```bash
# Conectar ao container MongoDB
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Backup do banco de dados
docker-compose exec mongodb mongodump --uri="mongodb://admin:password123@localhost:27017/vera_db?authSource=admin" --out=/backup

# Visualizar coleções do banco
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin --eval "use vera_db; show collections"
```

## Padrão de trabalho

1. Crie uma branch de funcionalidade
2. Faça suas alterações
3. Adicione testes para nova funcionalidade
4. Certifique-se que todos os testes passam
5. Envie um pull request

## Licença

Este projeto está licenciado sob a Licença MIT.
