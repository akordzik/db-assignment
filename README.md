# Docker Setup Guide

This monorepo uses separate Dockerfiles for better maintainability and deployment flexibility.

## Architecture

- **Backend (db-api)**: NestJS application with Prisma ORM
- **Frontend (db-client)**: Angular application with SSR
- **Database**: PostgreSQL
- **Shared**: Common interfaces and types

## Quick Start

### Assign permissions to the shell file

```sh
chmod +x docker-start.sh
```

### Start the application

```sh
./docker-start.sh
```

### Application info

- The database is seeded with an admin user upon API startup
- The app uses an artificial in-memory Identity Provider (designed to mimic a service like AWS Cognito)
- All users authenticate with password 'admin123'
