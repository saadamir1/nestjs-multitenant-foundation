# NestJS GraphQL Realtime Foundation

**This repository is an advanced version of the original NestJS GraphQL Foundation, extended with real-time WebSocket features (chat, notifications, subscriptions) on top of the core GraphQL foundation.**

A comprehensive, production-ready NestJS GraphQL foundation with advanced authentication, security, and enterprise-grade features. Built with PostgreSQL, TypeORM, GraphQL, JWT authentication, refresh tokens, role-based access control, audit logging, **real-time chat**, **notifications**, **file uploads**, and **analytics** via WebSockets and GraphQL subscriptions.

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **GraphQL** - Query language with Apollo Server
- **TypeORM** - ORM for TypeScript with migration support
- **PostgreSQL** - Relational database
- **JWT** - Access and refresh token authentication
- **bcrypt** - Password hashing
- **Winston** - Logging library
- **Nodemailer** - Email service for password reset and verification
- **Socket.IO** - Real-time chat and notifications
- **Cloudinary** - Cloud-based image storage and optimization
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
- 💬 **Real-Time Chat** - Chat rooms, messaging, and subscriptions
- 🔔 **Notifications** - User notifications, unread count, mark as read, and real-time updates
- 📁 **File Upload** - Cloudinary integration with image optimization
- 📈 **Analytics Dashboard** - User growth, activity stats, and insights
- 💳 **Payments** - Stripe integration (optional branch)
- 📚 **GraphQL Playground** - Interactive GraphQL query interface
- ⚡ **Production Ready** - Error handling, validation, and security best practices

## 🌟 Branch Structure

### **Main Branch** (`master`)
Core foundation with essential features:
- Authentication & Security
- Real-time Chat & Notifications  
- File Uploads (Cloudinary)
- Analytics Dashboard
- Production-ready setup

### **Payments Branch** (`feature/payments`)
Complete foundation + Stripe payments integration:
```bash
# To use payments version
git checkout feature/payments
# or merge into your project
git merge feature/payments
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/saadamir1/nestjs-graphql-realtime-foundation.git
cd nestjs-graphql-realtime-foundation
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

Required environment variables:

```env
# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=dev
DB_PASSWORD=secret
DB_NAME=demo

# JWT
JWT_SECRET=jwt-secret-key
JWT_EXPIRES_IN=900s
JWT_REFRESH_SECRET=jwt-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (for password reset and email verification)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3001

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (only in payments branch)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 4. Run Database Migrations

```bash
npm run migration:run
```

### 5. Run Application

```bash
npm run start:dev
```

**Local Development:**
- GraphQL Playground: `http://localhost:3000/graphql`
- GraphQL API: `http://localhost:3000/graphql`

## 📱 Frontend Integration

This backend is designed to be used with a separate React frontend. You can:

- Use the companion React frontend: `nestjs-graphql-realtime-frontend`
- Build your own custom frontend
- Connect any GraphQL-compatible frontend framework

**WebSocket Connection:**
```javascript
// Frontend WebSocket connection example
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Listen for real-time messages
socket.on('messageAdded', (message) => {
  console.log('New message:', message);
});
```

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
  bootstrapAdmin(
    bootstrapInput: {
      email: "admin@example.com"
      password: "admin123"
      firstName: "Admin"
      lastName: "User"
    }
  ) {
    access_token
    refresh_token
  }
}

# Login
mutation {
  login(loginInput: { email: "admin@example.com", password: "admin123" }) {
    access_token
    refresh_token
  }
}

# Refresh Token
mutation {
  refreshToken(refreshTokenInput: { refreshToken: "YOUR_REFRESH_TOKEN" }) {
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

# Create a city
mutation {
  createCity(
    createCityInput: {
      name: "New York"
      description: "The Big Apple"
      country: "USA"
    }
  ) {
    id
    name
    description
    country
  }
}
```

#### Email Services

```graphql
# Send password reset email
mutation {
  forgotPassword(forgotPasswordInput: { email: "user@example.com" }) {
    message
  }
}

# Reset password with token
mutation {
  resetPassword(
    resetPasswordInput: {
      token: "reset-token-from-email"
      newPassword: "newSecurePassword123"
    }
  ) {
    message
  }
}

# Send email verification
mutation {
  sendEmailVerification(emailVerificationInput: { email: "user@example.com" }) {
    message
  }
}

# Resend email verification (for expired tokens)
mutation {
  resendEmailVerification(emailVerificationInput: { email: "user@example.com" }) {
    message
  }
}

# Verify email with token
mutation {
  verifyEmail(verifyEmailInput: { token: "verification-token-from-email" }) {
    message
  }
}
```

## 🧪 GraphQL API Examples

### File Upload

```graphql
# Upload profile picture
mutation {
  uploadProfilePicture(file: $file)
}

# Upload general image
mutation {
  uploadImage(file: $file)
}
```

### Analytics (Admin Only)

```graphql
# Dashboard stats
query {
  dashboardStats {
    totalUsers
    totalMessages
    totalNotifications
    recentUsers {
      email
      firstName
    }
  }
}

# User growth data
query {
  userGrowth(days: 30) {
    date
    count
  }
}
```

### Chat & Notifications

```graphql
# Create chat room
mutation {
  createRoom(createRoomInput: { name: "General", participantIds: [1, 2] }) {
    id
    name
    participantIds
  }
}

# Get notifications
query {
  myNotifications {
    id
    type
    title
    message
    read
  }
}

# Subscribe to new messages
subscription {
  messageAdded {
    id
    content
    senderId
    roomId
  }
}
```

### Payments (feature/payments branch only)

```graphql
# Create payment intent
mutation {
  createPaymentIntent(createPaymentInput: { 
    amount: 29.99 
    description: "Premium subscription" 
  }) {
    clientSecret
    paymentIntentId
  }
}

# Get user payments
query {
  myPayments {
    id
    amount
    status
    description
    createdAt
  }
}
```

## 🗂️ Project Structure

```
src/
├── auth/              # Authentication (GraphQL resolvers)
├── users/             # User management (GraphQL resolvers)
├── cities/            # Cities CRUD example (GraphQL resolvers)
├── chat/              # Real-time chat functionality
├── notifications/     # User notifications system
├── upload/            # File upload with Cloudinary
├── analytics/         # Dashboard and user insights
├── payments/          # Stripe integration (payments branch only)
├── websockets/        # WebSocket gateway
├── common/            # Guards, decorators, middleware, services
│   ├── services/      # Email, Audit, Cloudinary services
│   ├── entities/      # Audit log entity
│   ├── guards/        # JWT, Roles, GraphQL guards
│   └── middleware/    # Logger middleware
├── migrations/        # Database migrations
├── data-source.ts     # TypeORM CLI configuration
├── schema.gql         # Auto-generated GraphQL schema
└── main.ts
```

## 🏷️ Version Tags

```bash
# Create version tags
git tag -a v1.0.0 -m "Core foundation release"
git tag -a v1.1.0 -m "Added file uploads and analytics"
git push origin --tags
```

## 📈 Commercial Value

This foundation is production-ready and can be used for:

- **SaaS Applications** - Complete user management and real-time features
- **E-commerce Platforms** - With payments branch for transactions
- **Social Platforms** - Chat, notifications, file uploads
- **Analytics Dashboards** - Built-in user insights and growth tracking
- **Starter Kit Sales** - Commercial foundation ($200-500+ value)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

**Happy Coding! 🚀**

## 📊 Project Stats

- **Enterprise-Grade Foundation** - Production-ready architecture
- **Modular Design** - Optional payments branch for flexibility
- **Real-time Features** - WebSockets, chat, notifications
- **File Management** - Cloudinary integration with optimization
- **Analytics Built-in** - Dashboard stats and user insights
- **100% TypeScript** - Full type safety
- **Comprehensive Testing** - Unit tests and E2E coverage
- **Database Migrations** - Version-controlled schema changes

### Tags

`nestjs` `graphql` `realtime` `websockets` `chat` `notifications` `file-upload` `analytics` `payments` `stripe` `cloudinary` `jwt-auth` `typescript` `production-ready`