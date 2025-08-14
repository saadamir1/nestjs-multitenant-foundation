# NestJS GraphQL Foundation

A comprehensive, production-ready NestJS GraphQL foundation with advanced authentication, security, and enterprise-grade features. Built with PostgreSQL, TypeORM, GraphQL, JWT authentication, refresh tokens, role-based access control, and audit logging.

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **GraphQL** - Query language with Apollo Server
- **TypeORM** - ORM for TypeScript with migration support
- **PostgreSQL** - Relational database
- **JWT** - Access and refresh token authentication
- **bcrypt** - Password hashing
- **Winston** - Logging library
- **Nodemailer** - Email service for password reset and verification
- **TypeScript** - Type safety

## ✨ Features

- 🔐 **JWT Authentication** (Access + Refresh Tokens)
- 🔄 **Token Refresh Mechanism**
- 🛡️ **Role-Based Access Control** (Admin/User)
- 🔒 **Hashed Passwords with bcrypt**
- 📧 **Password Reset via Email** (Secure token-based reset)
- ✉️ **Email Service Integration** (Nodemailer with Gmail)
- 📋 **Pagination Support** (GraphQL queries with pagination)
- 🧹 **Soft Delete Support** (e.g., cities)
- 🧾 **Request Logging** - Winston logger with file output
- 📊 **Audit Logging** - User activity tracking for security and compliance
- 🚀 **GraphQL API** - Type-safe queries and mutations with Apollo Server
- 📊 **Database Integration** - PostgreSQL with TypeORM
- 🔄 **Database Migrations** - Version control for database schema
- 🎯 **Type Safety** - Full TypeScript support
- 🧪 **Comprehensive Testing** - Unit tests, E2E tests, and test coverage
- 📚 **GraphQL Playground** - Interactive GraphQL query interface
- ⚡ **Production Ready** - Error handling, validation, and security best practices

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/saadamir1/nestjs-graphql-foundation.git
cd nestjs-graphql-foundation
npm install
```

### 2. Database Setup

```sql
CREATE USER dev WITH PASSWORD 'secret';
CREATE DATABASE demo OWNER dev;
GRANT ALL PRIVILEGES ON DATABASE demo TO dev;
```

### 3. Environment Variables

Copy and configure environment:

```bash
cp .env.example .env
# Edit .env with your actual values
```

Or create `.env` manually:

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=dev
DB_PASSWORD=secret
DB_NAME=demo
JWT_SECRET=jwt-secret-key
JWT_EXPIRES_IN=900s
JWT_REFRESH_SECRET=jwt-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development

# Email Configuration (for password reset)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3001

# Production Database URL (optional)
DATABASE_URL=postgresql://username:password@host:port/database
```

### 4. Run Database Migrations

```bash
# Run existing migrations
npm run migration:run

# Check migration status
npm run migration:show
```

### 5. Run Application

```bash
npm run start:dev
```

**Local Development:**

- GraphQL Playground: `http://localhost:3000/graphql`
- GraphQL API: `http://localhost:3000/graphql`

**🚀 Live Production:**

- GraphQL API: `https://nestjs-graphql-foundation.onrender.com/graphql`
- GraphQL Playground: `https://nestjs-graphql-foundation.onrender.com/graphql`

## 🧪 GraphQL API

### GraphQL Playground

Access the interactive GraphQL playground at `http://localhost:3000/graphql` to:

- Explore the schema
- Write and test queries/mutations
- View documentation
- Test authentication

### Sample GraphQL Queries

#### Authentication

```graphql
# Bootstrap Admin (First time setup)
mutation {
  bootstrapAdmin(bootstrapInput: {
    email: "admin@example.com"
    password: "admin123"
    firstName: "Admin"
    lastName: "User"
  }) {
    access_token
    refresh_token
  }
}

# Login
mutation {
  login(loginInput: { 
    email: "admin@example.com" 
    password: "admin123" 
  }) {
    access_token
    refresh_token
  }
}

# Refresh Token
mutation {
  refreshToken(refreshTokenInput: {
    refreshToken: "YOUR_REFRESH_TOKEN"
  }) {
    access_token
    refresh_token
  }
}
```

#### Protected Queries (Add Authorization Header)

```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

```graphql
# Get current user
query {
  me {
    id
    email
    firstName
    lastName
    role
  }
}

# Get all users (Admin only)
query {
  users {
    id
    email
    firstName
    lastName
    role
    isEmailVerified
  }
}
```

#### Cities CRUD

```graphql
# Get all cities with pagination
query {
  cities(filter: { page: 1, limit: 10 }) {
    data {
      id
      name
      description
      country
      active
    }
    total
    page
    lastPage
  }
}

# Get single city
query {
  city(id: 1) {
    id
    name
    description
    country
    active
  }
}

# Create a city
mutation {
  createCity(createCityInput: {
    name: "New York"
    description: "The Big Apple"
    country: "USA"
  }) {
    id
    name
    description
    country
  }
}

# Update city
mutation {
  updateCity(id: 1, updateCityInput: {
    description: "Updated description"
  }) {
    id
    name
    description
    country
  }
}

# Delete city
mutation {
  deleteCity(id: 1)
}
```

#### User Management

```graphql
# Update user profile
mutation {
  updateProfile(updateProfileInput: {
    firstName: "Updated"
    lastName: "Name"
  }) {
    id
    firstName
    lastName
  }
}

# Change password
mutation {
  changePassword(changePasswordInput: {
    currentPassword: "oldPassword"
    newPassword: "newPassword123"
  })
}

# Register new user (Admin only)
mutation {
  register(registerInput: {
    email: "user@example.com"
    password: "securePassword123"
    firstName: "John"
    lastName: "Doe"
  }) {
    message
  }
}
```

#### Email Services

```graphql
# Send password reset email
mutation {
  forgotPassword(forgotPasswordInput: {
    email: "user@example.com"
  }) {
    message
  }
}

# Reset password with token
mutation {
  resetPassword(resetPasswordInput: {
    token: "reset-token-from-email"
    newPassword: "newSecurePassword123"
  }) {
    message
  }
}

# Send email verification
mutation {
  sendEmailVerification(emailVerificationInput: {
    email: "user@example.com"
  }) {
    message
  }
}

# Verify email with token
mutation {
  verifyEmail(verifyEmailInput: {
    token: "verification-token-from-email"
  }) {
    message
  }
}
```

## 🔁 Token Flow

- **Access Token** expires in 15 mins
- **Refresh Token** stored securely in DB (7 days)
- Use `refreshToken` mutation to get new tokens without re-login

## 🗃️ Database Migrations

### Migration Commands

```bash
# Generate migration from entity changes
npm run migration:generate src/migrations/YourMigrationName

# Create empty migration
npm run migration:create src/migrations/YourMigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### Migration Workflow

1. **Modify entities** → Update your TypeORM entities
2. **Generate migration** → `npm run migration:generate src/migrations/FeatureName`
3. **Review migration** → Check generated SQL in migration file
4. **Run migration** → `npm run migration:run`
5. **Deploy** → Migrations run automatically in production

### Production Deployment

```bash
# Build application
npm run build

# Run migrations
npm run migration:run

# Start production server
npm run start:prod
```

## 📄 Database Schema

### User

```json
{
  "id": "number",
  "email": "string (unique)",
  "password": "string (hashed)",
  "firstName": "string",
  "lastName": "string",
  "role": "admin | user",
  "refreshToken": "string (hashed)",
  "isEmailVerified": "boolean",
  "profilePicture": "string (optional)"
}
```

### City (Pagination Response)

```json
{
  "data": [
    {
      "id": "number",
      "name": "string (unique)",
      "description": "string",
      "country": "string",
      "active": "boolean",
      "imageUrl": "string (optional)",
      "deletedAt": "Date | null"
    }
  ],
  "total": "number",
  "page": "number",
  "lastPage": "number"
}
```

## 🔐 Authentication & Authorization

- JWT tokens for authentication (access + refresh)
- Role-based access control with custom guards
- Passwords hashed with bcrypt
- Refresh tokens securely stored in database
- Email verification system
- Password reset via email

## 🗂️ Project Structure

```
src/
├── auth/              # Authentication logic (GraphQL resolvers)
├── users/             # User management (GraphQL resolvers)
├── cities/            # Cities CRUD (GraphQL resolvers)
├── common/            # Guards, decorators, middleware, services
│   ├── services/      # Email, Audit services
│   ├── entities/      # Audit log entity
│   ├── guards/        # JWT, Roles, GraphQL guards
│   └── middleware/    # Logger middleware
├── migrations/        # Database migrations
├── data-source.ts     # TypeORM CLI configuration
├── migration.config.ts # Migration configuration
├── schema.gql         # Auto-generated GraphQL schema
├── app.module.ts
└── main.ts
logs/                  # Application logs
```

## 🧪 Testing

This project includes comprehensive testing with **60 unit tests** and **6 E2E tests** covering critical functionality.

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

**Test Coverage:**

- ✅ **Services**: All CRUD operations, authentication, email verification, profile management
- ✅ **Resolvers**: GraphQL endpoints, request/response handling
- ✅ **Auth**: Login, refresh tokens, JWT validation, email verification
- ✅ **Users**: Profile updates, password changes, user management
- ✅ **Audit**: Activity logging and tracking
- ✅ **Error Handling**: 404s, validation errors, unauthorized access

### E2E Tests

```bash
# Run end-to-end tests
npm run test:e2e
```

**E2E Test Coverage:**

- ✅ **Health Check**: API status endpoint
- ✅ **Email Verification**: Send verification, verify email, login blocking
- ✅ **Authentication Flow**: Complete email verification workflow
- ✅ **Database**: Proper cleanup and isolation

## 📜 Available Scripts

```bash
# Development
npm run start:dev              # Development server
npm run start:prod             # Production server
npm run build                  # Build application

# Testing
npm run test                   # Run unit tests
npm run test:watch             # Watch mode tests
npm run test:cov               # Test coverage report
npm run test:e2e               # End-to-end tests
npm run test:debug             # Debug tests

# Database Migrations
npm run migration:generate     # Generate migration from entities
npm run migration:create       # Create empty migration
npm run migration:run          # Run pending migrations
npm run migration:revert       # Revert last migration
npm run migration:show         # Show migration status
```

## 🔧 Troubleshooting

**Database Issues:**

- Ensure PostgreSQL is running
- Check user permissions
- Run `npm run migration:show` to check migration status

**Migration Issues:**

- Ensure `NODE_ENV` is set in `.env`
- Check `src/data-source.ts` configuration
- Verify migration files are in `src/migrations/`

**Token Issues:**

- Verify JWT secrets in `.env`
- Use refresh mutation when access token expires
- Check `Authorization: Bearer <token>` format in GraphQL headers

**Email Issues:**

- Check Gmail app password is correct (16 characters)
- Verify 2-Factor Authentication is enabled on Gmail
- Check spam folder for reset emails
- Ensure `EMAIL_USER` and `EMAIL_PASS` are set in `.env`
- Verify `FRONTEND_URL` matches your frontend domain

**Permission Denied:**

- Verify user role in database
- Check endpoint permissions (admin vs user)
- Ensure proper Authorization header in GraphQL requests

**GraphQL Issues:**

- Use GraphQL Playground for testing queries
- Check schema documentation in playground
- Verify query syntax and field names
- Ensure proper authentication headers for protected queries

## 🐳 Docker Support

### Quick Start with Docker

```bash
# Start entire stack (app + database)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

### Production Docker Build

```bash
# Build image
docker build -t nestjs-graphql-foundation .

# Run container
docker run -p 3000:3000 --env-file .env nestjs-graphql-foundation
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes and add migrations if needed
4. **Write tests** for new features
5. Run `npm run test` and `npm run test:e2e` to ensure all tests pass
6. Run `npm run migration:generate` for schema changes
7. Commit changes with descriptive messages
8. Push and create Pull Request

### Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Set up database and run migrations
npm run migration:run

# 3. Start development server
npm run start:dev

# 4. Run tests during development
npm run test:watch

# 5. Run E2E tests before committing
npm run test:e2e
```

---

**Happy Coding! 🚀**

## 📈 Project Stats

- **60 Unit Tests** - Comprehensive service and resolver testing
- **6 E2E Tests** - Health check and email verification workflows
- **100% TypeScript** - Full type safety
- **JWT Security** - Access + refresh token implementation
- **Email Verification** - Token-based email verification system
- **Audit Logging** - User activity tracking for security
- **Profile Management** - User profile updates and password changes
- **Database Migrations** - Version-controlled schema changes
- **GraphQL Schema** - Auto-generated, type-safe API schema
- **Production Ready** - Error handling, validation, logging, comprehensive testing

### Tags

`nestjs` `graphql` `apollo-server` `typeorm` `postgresql` `jwt-auth` `refresh-tokens` `rbac` `typescript` `migrations` `database-versioning` `jest-testing` `e2e-testing` `winston-logging` `production-ready`

## 🔗 Related Projects

- **REST Version**: [nestjs-pg-crud](https://github.com/saadamir1/nestjs-pg-crud) - The original REST API foundation this project was transformed from