# Metric Tracking System

A modern metric tracking system built with NestJS, TypeScript, and PostgreSQL. This application provides comprehensive APIs for managing and tracking various metrics with robust data persistence and validation.

## Description

This project is a scalable metric tracking system that allows users to create, retrieve, and manage metrics through RESTful APIs. Built with modern technologies including NestJS framework, PostgreSQL database, and Prisma ORM for efficient data management.

## Prerequisites

### Option 1: Local Development
- Node.js version 21.7.3
- PostgreSQL database
- npm or yarn package manager

### Option 2: Docker (Recommended)
- Docker
- Docker Compose

## Installation & Setup

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd metric-tracking-system
   ```

2. **Run with Docker Compose**
   ```bash
   # Build and start all services (PostgreSQL + Application)
   docker-compose up --build
   
   # Or run in background
   docker-compose up -d --build
   ```

3. **Access the application**
   - Application: http://localhost:3000
   - Swagger API Documentation: http://localhost:3000/docs

### Option 2: Development with Docker (Database only)

1. **Start only PostgreSQL with Docker**
   ```bash
   # Start only the database
   docker-compose up postgres -d
   ```

2. **Run application locally**
   ```bash
   # Copy environment file
   cp .env.example .env
   
   # Install dependencies
   npm install
   
   # Run migrations
   npm run migrate:dev
   
   # Seed database
   npm run seed
   
   # Start development server
   npm run start:dev
   ```

### Option 3: Local Development (Without Docker)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd metric-tracking-system
   ```

2. **Environment Configuration**
   ```bash
   # Copy environment file
   cp .env.example .env
   ```
   
   Update the `.env` file with your database configuration and other environment variables.

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Database Migration**
   ```bash
   npm run migrate:dev
   ```

5. **Seed Database**
   ```bash
   npm run seed
   ```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Watch mode
npm run start
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

**http://localhost:3000/docs**

The Swagger interface provides interactive documentation for all available endpoints, request/response schemas, and allows you to test the APIs directly.

## Available Scripts

### Docker Commands
```bash
# Start all services (recommended)
docker-compose up --build

# Start in background
docker-compose up -d --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose down && docker-compose up --build
```

### NPM Scripts
```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Run production server
npm run start:prod

# Run database migrations
npm run migrate:dev

# Seed database with initial data
npm run seed

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run test coverage
npm run test:cov
```

## Project Structure

```
src/
├── common/          # Shared utilities, constants, and helpers
├── core/           # Core modules (database, config, logger)
├── modules/        # Feature modules (metric tracking)
└── main.ts         # Application entry point
```

## Features

- **Metric Management**: Create, read, update, and delete metrics
- **Data Validation**: Robust input validation using DTOs
- **Database Integration**: PostgreSQL with Prisma ORM
- **API Documentation**: Auto-generated Swagger documentation
- **Error Handling**: Centralized error handling and logging

## Technologies Used

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Configuration**: @nestjs/config

