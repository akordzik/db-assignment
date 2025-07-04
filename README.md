# Setup Guide

This monorepo uses separate Dockerfiles for better maintainability and deployment flexibility.

## Architecture

- **Backend (db-api)**: NestJS application with Prisma ORM
- **Frontend (db-client)**: Angular application with SSR
- **Database**: PostgreSQL
- **Shared**: Common interfaces and types

## Quick Start - Docker

### Prerequisites

- Docker
- Docker Compose

### Assign permissions to the shell file

```sh
chmod +x docker-start.sh
```

### Start the application

```sh
./docker-start.sh
```

## Quick Start - local setup

### Prerequisites

- Node
- `nx`

### Install dependencies

```sh
npm ci
```

### Create .env file

```sh
cp apps/db-api/.env.example apps/db-api/.env
```

### Run service

```sh
npm run dev
```

## Application info

- The database is seeded with an admin user upon API startup
- The app uses an artificial in-memory Identity Provider (designed to mimic a service like AWS Cognito)
- All users authenticate with password 'admin123'
