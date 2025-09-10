# V.E.R.A — Valor Efetivo de Renda Analisada

V.E.R.A é um acrônimo para **Valor Efetivo de Renda Analisada**, um serviço que processa a renda e o tempo de trabalho de um profissional para embasar análises de crédito. O projeto foi desenvolvido com foco em demonstrar **padrões de arquitetura limpa, flexibilidade de persistência e qualidade de código**, pilares essenciais em uma aplicação de back-end.

## Visão Geral do Projeto

Esta aplicação é uma API REST desenvolvida em **NestJS** que gerencia registros de funcionários, calculando automaticamente valores de salário e tempo de trabalho. O grande diferencial do projeto é a flexibilidade, permitindo alternar facilmente entre persistência em memória para desenvolvimento rápido e **MongoDB** para produção, utilizando uma arquitetura modular e aderente aos princípios **SOLID**.

## Stack de Tecnologias

- **Backend**: Node.js, TypeScript, NestJS
- **Banco de Dados**: MongoDB (com Mongoose ODM)
- **Containerização**: Docker & Docker Compose
- **Persistência**: Padrão de Repositório com estratégia dupla (In-Memory / MongoDB)
- **Validação**: Esquemas Zod com decorators customizados
- **Documentação da API**: Swagger/OpenAPI

## Arquitetura do Projeto

### Estrutura de Arquivos

```
src/
├── common/           # Utilitários e infraestrutura compartilhados
│ ├── decorators/     # Decorators personalizados (ZodBody)
│ ├── enums/          # Enums para toda a aplicação
│ ├── filters/        # Tratamento global de exceções
│ └── utils/          # Funções utilitárias (data, salário)
├── registros/        # Módulo de domínio principal
│ ├── dto/            # Data Transfer Objects
│ ├── entities/       # Entidades de domínio
│ ├── interfaces/     # Contratos de Repository
│ ├── repositories/   # Implementações de acesso a dados
│ ├── schemas/        # Schemas do MongoDB
│ └── swagger/        # Documentação da API
├── app.module.ts     # Módulo raiz
└── main.ts           # Ponto de entrada da aplicação
```

## Componentes Principais

### Entities

- **Registro**: Entidade de domínio que representa os registros de funcionários
  - Contém lógica de negócio no construtor
  - Gera UUID automaticamente
  - Encapsula campos calculados

### DTOs e Validações

- **Input Validation**: Schemas Zod para validação em tempo de execução
- **DTO Classes**: Classes DTOs separadas para operações de Create/Update
- **Swagger DTOs**: Classes dedicadas para a documentação da API
- **Custom Decorator**: `@ZodBody` para validação de requisição

### Repository Pattern

- **Interface**: `IRegistrosRepository` define o contrato
- **Implementações**:
  - `MongoRegistrosRepository`: Persistência em produção com MongoDB
  - `InMemoryRegistrosRepository`: Para testes e desenvolvimento
- **Dynamic Selection**: O Repository é escolhido com base na configuração do ambiente

### Service Layer

- **RegistrosService**: Orquestração da lógica de negócio
  - Cálculos de salário (regra dos 35%)
  - Cálculos de tempo decorrido da data
  - Tratamento de erro com retornos de tupla `[Error, Result]`
  - Abstração do Repository através de dependency injection

### Controller Layer

- **RegistrosController**: Tratamento de requisições HTTP
  - Endpoints RESTful (operações CRUD)
  - Análise de query parameters para filtragem
  - Suporte a pagination
  - Formatação de resposta

## Padrões de Key Design

### Dependency Injection

- Injeção baseada em interface para os repositories
- Padrão de Factory para seleção dinâmica do repository
- Troca de provider baseada em configuração

### Error Handling

- Filtro de exceção global com processamento de erro centralizado
- Tradução de erros de validação Zod
- Formato de resposta de erro consistente
- Mensagens de erro internacionalizadas

### Fluxo de Dados

1. Requisição → Controller (validação via ZodBody)
2. Controller → Service (lógica de negócio)
3. Service → Repository (persistência de dados)
4. Repository → Database/Memory
5. Transformação da resposta e retorno

## Gerenciamento de Configuração

- Configuração baseada em ambiente via ConfigModule
- Conexão de banco de dados dinâmica (MongoDB ou in-memory)
- Configuração de CORS baseada no ambiente
- Configuração de porta com fallback

## Recursos da API

- **Pagination**: Tamanho da página e ordenação configuráveis
- **Filtering**: Suporte a filtragem de múltiplos campos
- **Sorting**: Ordenação de campo dinâmica (asc/desc)
- **Validation**: Validação de requisição com mensagens de erro detalhadas
- **Documentation**: Swagger UI gerado automaticamente

## Funções Utilitárias

- **DateUtils**: Cálculos de tempo decorrido
- **SalaryUtils**: Cálculos de salário baseados em porcentagem
- **Error Translations**: Mensagens de erro internacionalizadas

## Pré-requisitos

- Node.js >= 18
- pnpm >= 8
- Docker & Docker Compose (para configuração com MongoDB)

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

# Garantir USE_DATABASE=false no .env
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

## Scripts Principais

| Script            | Descrição                                        |
| :---------------- | :----------------------------------------------- |
| `pnpm dev:start`  | Inicia ambiente completo com Docker Compose      |
| `pnpm start:dev`  | Executa aplicação localmente (em memória)        |
| `pnpm start:prod` | Executa aplicação localmente em modo de produção |
| `pnpm test`       | Executa testes unitários                         |
| `pnpm test:cov`   | Executa testes com relatório de cobertura        |
| `pnpm test:e2e`   | Executa testes end-to-end                        |

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

## Testes

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
