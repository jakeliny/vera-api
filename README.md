# V.E.R.A — Valor Efetivo de Renda Analisada

V.E.R.A is an acronym for **Valor Efetivo de Renda Analisada** (Effective Analyzed Income Value), a service that processes a professional's income and work time to support credit analysis. The project was developed with a focus on demonstrating **clean architecture patterns, persistence flexibility, and code quality**, which are essential pillars of a back-end application.

## Project Overview

This application is a REST API developed in **NestJS** that manages employee records, automatically calculating salary values and work time. The project's main differentiator is its flexibility, allowing it to easily switch between in-memory persistence for rapid development and **MongoDB** for production, using a modular architecture that adheres to **SOLID** principles.

## Technology Stack

- **Backend**: Node.js, TypeScript, NestJS
- **Database**: MongoDB (with Mongoose ODM)
- **Containerization**: Docker & Docker Compose
- **Persistence**: Repository Pattern with a dual strategy (In-Memory / MongoDB)
- **Validation**: Zod schemas with custom decorators
- **API Documentation**: Swagger/OpenAPI

## Project Architecture

### File Structure

```
src/
├── common/ # Shared utilities and infrastructure
│ ├── decorators/ # Custom decorators (ZodBody)
│ ├── enums/ # Enums for the entire application
│ ├── filters/ # Global exception handling
│ └── utils/ # Utility functions (date, salary)
├── registros/ # Main domain module
│ ├── dto/ # Data Transfer Objects
│ ├── entities/ # Domain entities
│ ├── interfaces/ # Repository contracts
│ ├── repositories/ # Data access implementations
│ ├── schemas/ # MongoDB schemas
│ └── swagger/ # API documentation
├── app.module.ts # Root module
└── main.ts # Application entry point

```

## Main Components

### Entities

- **Registro**: Domain entity that represents employee records
  - Contains business logic in the constructor
  - Automatically generates UUID
  - Encapsulates calculated fields

### DTOs and Validations

- **Input Validation**: Zod schemas for runtime validation
- **DTO Classes**: Separate DTO classes for Create/Update operations
- **Swagger DTOs**: Dedicated classes for API documentation
- **Custom Decorator**: `@ZodBody` for request validation

### Repository Pattern

- **Interface**: `IRegistrosRepository` defines the contract
- **Implementations**:
  - `MongoRegistrosRepository`: Production persistence with MongoDB
  - `InMemoryRegistrosRepository`: For testing and development
- **Dynamic Selection**: The Repository is chosen based on the environment configuration

### Service Layer

- **RegistrosService**: Business logic orchestration
  - Salary calculations (35% rule)
  - Elapsed time calculations from the date
  - Error handling with `[Error, Result]` tuple returns
  - Repository abstraction through dependency injection

### Controller Layer

- **RegistrosController**: HTTP request handling
  - RESTful endpoints (CRUD operations)
  - Query parameter analysis for filtering
  - Pagination support
  - Response formatting

## Key Design Patterns

### Dependency Injection

- Interface-based injection for repositories
- Factory pattern for dynamic repository selection
- Provider swapping based on configuration

### Error Handling

- Global exception filter with centralized error processing
- Translation of Zod validation errors
- Consistent error response format
- Internationalized error messages

### Data Flow

1. Request → Controller (validation via ZodBody)
2. Controller → Service (business logic)
3. Service → Repository (data persistence)
4. Repository → Database/Memory
5. Response transformation and return

## Configuration Management

- Environment-based configuration via ConfigModule
- Dynamic database connection (MongoDB or in-memory)
- CORS configuration based on the environment
- Port configuration with fallback

## API Features

- **Pagination**: Configurable page size and sorting
- **Filtering**: Support for filtering multiple fields
- **Sorting**: Dynamic field sorting (asc/desc)
- **Validation**: Request validation with detailed error messages
- **Documentation**: Automatically generated Swagger UI

## Utility Functions

- **DateUtils**: Elapsed time calculations
- **SalaryUtils**: Percentage-based salary calculations
- **Error Translations**: Internationalized error messages

## Prerequisites

- Node.js >= 18
- pnpm >= 8
- Docker & Docker Compose (for MongoDB setup)

## Installation and Configuration

```bash
# Install dependencies
pnpm install
```

### Environment Variables

The application supports two persistence modes, controlled by the USE_DATABASE environment variable.

Copy the .env.example file from the project root and create a .env file:

```
NODE_ENV=
PORT=
USE_DATABASE=

MONGO_ROOT_USERNAME=
MONGO_ROOT_PASSWORD=
MONGO_DATABASE=
MONGODB_URI=
```

- USE_DATABASE=false: Uses the in-memory repository.
- USE_DATABASE=true: Uses the MongoDB repository.

## How to Run the Application

### Option 1: Local Development (In-Memory)

Ideal for quick development and testing without external dependencies.

```bash
# Ensure USE_DATABASE=false in .env
echo "USE_DATABASE=false" >> .env

# Run in development mode
pnpm start:dev
```

**Features:**

- No external dependencies.
- Fast startup.
- Data is not persisted and is reset with each `restart`.

### Option 2: Production Configuration (MongoDB with Docker)

Recommended for environments that require persistent storage.

```
# Start the application and database containers
pnpm dev:start

# View logs
pnpm dev:logs

# Stop the containers
pnpm dev:stop
```

**Features:**

- Persistent data storage.
- Ready-to-replicate configuration for production.
- Automatic database connection.

## Main Scripts

| Script            | Description                                         |
| ----------------- | --------------------------------------------------- |
| `pnpm dev:start`  | Starts the complete environment with Docker Compose |
| `pnpm start:dev`  | Runs the application locally (in-memory)            |
| `pnpm start:prod` | Runs the application locally in production mode     |
| `pnpm test`       | Runs unit tests                                     |
| `pnpm test:cov`   | Runs tests with a coverage report                   |
| `pnpm test:e2e`   | Runs end-to-end tests                               |

## API Documentation and Endpoints

Once running, the interactive API documentation is available at Swagger UI:

> http://localhost:3000/api

### Main Endpoints

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/registros`     | Create a new record |
| GET    | `/registros`     | List all records    |
| GET    | `/registros/:id` | Find a record by ID |
| PUT    | `/registros/:id` | Update a record     |
| DELETE | `/registros/:id` | Delete a record     |

## Tests

### Running Tests

```bash
# Unit tests
pnpm test

# End-to-end tests
pnpm test:e2e
# Coverage report
pnpm test:cov

# Watch mode for development
pnpm test:watch
```

### Data Persistence Testing

#### Testing In-Memory Mode

```bash
# 1. Ensure USE_DATABASE=false in .env
echo "USE_DATABASE=false" >> .env

# 2. Start the application
pnpm start:dev

# 3. Create a record
curl -X POST http://localhost:3000/registros \
 -H "Content-Type: application/json" \
 -d '{"employee": "Test User", "admissionDate": "2024-01-01", "salary": 4000}'

# 4. Verify that the record exists
curl -X GET http://localhost:3000/registros

# 5. Restart the application (Ctrl+C and run again)

# 6. Check records (should be empty - data is not persisted)
curl -X GET http://localhost:3000/registros
```

#### Testing MongoDB Persistence

```bash
# 1. Start with Docker Compose
pnpm dev:start

# 2. Create a record
curl -X POST http://localhost:3000/registros \
 -H "Content-Type: application/json" \
 -d '{"employee": "Persistent User", "admissionDate": "2024-01-01", "salary": 5500}'

# 3. Verify that the record exists
curl -X GET http://localhost:3000/registros

# 4. Restart containers
pnpm dev:restart

# 5. Check records (should still exist - data is persisted in MongoDB)
curl -X GET http://localhost:3000/registros

```

## Code Quality

```bash
# Check code
pnpm lint

# Format code
pnpm format

# Compile application
pnpm build
```

## Docker Commands

### Application Management

```bash
# Build and start all services
pnpm dev:start

# Start only a specific service
docker-compose up mongodb

# View service logs
pnpm dev:logs

# Run commands in a running container
docker-compose exec app pnpm test

# Complete cleanup of volumes and networks
pnpm dev:stop --volumes --remove-orphans
```

### Database Management

```bash
# Connect to the MongoDB container
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Database backup
docker-compose exec mongodb mongodump --uri="mongodb://admin:password123@localhost:27017/vera_db?authSource=admin" --out=/backup

# View database collections

docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin --eval "use vera_db; show collections"
```

## Workflow

1. Create a feature branch
2. Make your changes
3. Add tests for the new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.
