# Voltex — PaaS Deployment Platform

A highly scalable **Platform-as-a-Service (PaaS)** solution that lets developers deploy modern frontend applications (React, Vue, Angular, etc.) by simply providing a GitHub repository URL. The platform automates cloning, building, and hosting on a custom subdomain — all wrapped in a slick web dashboard called **Voltex**.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Environment Variables](#environment-variables)
   - [Docker Setup](#docker-setup)
   - [Local Development](#local-development)
4. [API Endpoints](#api-endpoints)
   - [Upload Service](#upload-service)
   - [User Backend](#user-backend)
   - [WebSocket Server](#websocket-server)
5. [Authentication](#authentication)
6. [Database Schema](#database-schema)
7. [Subdomain Configuration](#subdomain-configuration)
8. [Project Structure](#project-structure)
9. [Security Notes](#security-notes)
10. [Author](#author)

---

## Introduction

Voltex enables developers to deploy frontend projects effortlessly by leveraging Git-based workflows. The system automates cloning, building, and hosting processes so you can focus on writing code. A web dashboard provides authentication (GitHub OAuth, Google OAuth, email/password), real-time build logs via WebSocket, and deployment management.

---

## Architecture Overview

```
                    ┌─────────────┐
                    │   GitHub    │
                    └──────┬──────┘
                           │ git clone
                           ▼
┌──────────┐     ┌──────────────────┐     ┌──────────────┐
│          │────▶│  Upload Service  │────▶│              │
│ Frontend │     │  POST /deploy   │      │      S3      │
│          │     │  GET /status     │     │              │
└──────────┘     │  GET/deployments │     └─────┬────────┘
      │          └────────┬─────────┘           │
      │                   │                     │
      │            ┌──────▼────────┐            │
      │            │    Redis      │            │
      │            │  - build-queue│            │
      │            │  - status     │◀───────────┤
      │            │  - logs:*     │            │
      │            │  - logs:list:*│            │
      │            └──────┬────────┘            │
      │                   │                     │
      │          ┌────────▼────────┐            │
      │          │ Deploy Service  │────────────┤
      │          │ (background     │  uploads   │
      │          │  worker)        │  dist/*    │
      │          │  - download S3  │            │
      │          │  - docker build │            │
      └──────────┤  - copy dist    │            │
                 └────────┬────────┘            │
                          │                     │
                 ┌────────▼────────┐            │
                 │  WebSocket      │            │
                 │  Server (:8082) │            │
                 │  (live logs)    │            │
                 └────────┬────────┘            │
                          │                     │
                 ┌────────▼────────┐            │
                 │                 │ ◀──────────┤
                 │ Request Handler │ serves     │
                 │                 │ dist/<id>  │
                 └────────┬────────┘            │
                          │                     │
                    ┌─────▼─────┐               │
                    │  Nginx    │               │
                    │ (host,    │               │
                    │  :80/443) │               │
                    └───────────┘               │
                                                │
                 ┌──────────────┐               │
                 │ User Backend │───────────────┤
                 │              │  (separate)   │
                 │  Prisma + PG │               │
                 │  Auth API    │               │
                 └──────────────┘               │
                                                │
                 ┌──────────────┐               │
                 │  PostgreSQL  │               │
                 │  (users DB)  │───────────────│
                 └──────────────┘
```

**Core Components:**

| Service | Responsibility | Port |
|---|---|---|
| **upload-service** | Accepts GitHub repo URLs, clones the codebase, uploads source to S3, enqueues build jobs in Redis | 3011 |
| **deploy-service** | Background worker — pops from Redis queue, downloads source from S3, runs `npm install && npm run build` in an isolated Docker container, uploads built `dist/` back to S3 | — |
| **request-handler** | Reverse-proxy / asset server — serves built frontend assets from S3 based on subdomain (e.g., `<id>.deploy.domain.com`) | 3012 |
| **frontend** | Voltex dashboard (Next.js 14) — landing page, GitHub/Google/email auth, deployment management, real-time log viewer | 3014 |
| **user-backend** | REST API for user management and authentication (Prisma + PostgreSQL, bcrypt + JWT) | 3010 |
| **ws-server** | WebSocket server for real-time deployment log streaming via Redis pub/sub | 8082 |
| **Redis** | Message broker for build jobs, deployment status store, logs pub/sub | 6379 |
| **PostgreSQL** | User data persistence | 5432 |
| **Nginx** (host) | Terminates TLS, routes `*.deploy.<domain>` to the request-handler | 80/443 |

---

## Getting Started

### Prerequisites

- **Docker** & **Docker Compose**
- A registered **domain name** (e.g., `example.com`)
- A **wildcard DNS record** (`*.deploy.${DOMAIN_NAME}`) pointed to your server's IP
- An **S3-compatible object storage** (AWS S3, Cloudflare R2, DigitalOcean Spaces, MinIO)
- A **Linux VM** or server with ports **80** and **443** accessible
- (Optional) **Node.js 18+** for local development without Docker

### Environment Variables

Three separate `.env` files need to be configured:

**Root `.env` (`./.env`):**

```env
# Redis
REDIS_URL=redis://myredis:6379

# S3 / Object Storage
accessKeyId=your_access_key
secretAccessKey=your_secret_key
endpoint=https://your-s3-endpoint.com

# Docker shared output path (host bind mount for deploy-service)
HOST_SHARED_OUTPUT=/path/to/shared-output

# JWT secret (used by upload-service and ws-server)
JWT_SECRET=change-this-in-production

# PostgreSQL
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=postgres
```

**Frontend `.env` (`./frontend/.env`):**

```env
# OAuth credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Service URLs
NEXT_PUBLIC_APP_URL=http://localhost:3014
NEXT_PUBLIC_BACKEND_URL=http://localhost:3010
NEXT_PUBLIC_UPLOAD_URL=http://localhost:3011
NEXT_PUBLIC_WS_URL=ws://localhost:8081
```

**User Backend `.env` (`./user-backend/.env`):**

```env
PORT=3019
DATABASE_URL=postgresql://postgres:postgres@mypostgres:5432/postgres
JWT_SECRET=change-this-in-production
```

### Docker Setup

Build and start all services:

```bash
docker compose up --build -d
```

This launches:

| Service | Container Name | Internal Port | External Port |
|---|---|---|---|
| upload-service | — | 3000 | **3011** |
| request-handler | — | 3001 | **3012** |
| frontend | — | 3000 | **3014** |
| user-backend | — | 3019 | **3010** |
| websocket-backend | — | 8081 | **8082** |
| deploy-service | — | — | (background worker, no HTTP) |
| Redis | myredis | 6379 | **6379** |
| PostgreSQL | mypostgres | 5432 | **5432** |

Stop all services:

```bash
docker compose down
```

### Local Development

Each service can be run individually without Docker:

```bash
# upload-service (port 3000)
cd upload-service && npm install && npm run dev

# deploy-service (background worker)
cd deploy-service && npm install && npm run dev

# request-handler (port 3001)
cd request-handler && npm install && npm run dev

# frontend (port 3000)
cd frontend && npm install && npm run dev

# user-backend (port 3019)
cd user-backend && npx prisma generate && npm run dev

# ws-server (port 8081)
cd ws-server && npm install && npm run dev
```

Requires Redis and PostgreSQL running locally (or adjust connection strings in `.env`).

---

## API Endpoints

### Upload Service

Base URL: `http://upload.${DOMAIN_NAME}`

| Method | Path | Description |
|---|---|---|
| `POST` | `/deploy` | Deploy a GitHub repository |
| `GET` | `/status?id=<id>` | Check deployment status |
| `GET` | `/deployments` | List all deployments |

**POST /deploy**

```http
POST http://upload.example.com/deploy
Content-Type: application/json

{
  "repoUrl": "https://github.com/user/repo"
}
```

Response:

```json
{
  "id": "abc123"
}
```

**GET /status**

```http
GET http://upload.example.com/status?id=abc123
```

Response:

```json
{
  "id": "abc123",
  "status": "uploaded | building | deployed | failed",
  "message": "Informative status message"
}
```

**GET /deployments**

```http
GET http://upload.example.com/deployments
```

Returns an array of deployments with status, repo URL, timestamps, branch, commit SHA, duration, and failure reason.

**Deployed Site**

```
http://<id>.deploy.${DOMAIN_NAME}
```

### User Backend

Base URL: `http://localhost:3010`

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Register with name, email, password |
| `POST` | `/auth/login` | Login with email, password |
| `POST` | `/auth/verify` | Verify JWT token |
| `GET` | `/users?username=` | Find user by username |
| `POST` | `/users` | Create or find user |

**POST /auth/register**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

Returns JWT token (7-day expiry) with user data.

**POST /auth/login**

```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

Returns JWT token with user data.

**POST /auth/verify**

Header: `Authorization: Bearer <token>`

Returns user data if token is valid.

### WebSocket Server

Base URL: `ws://upload.${DOMAIN_NAME}` (port **8081**, mapped to **8082**)

Connect and send:

```json
{
  "id": "abc123"
}
```

The server responds with stored logs (from Redis list `logs:list:<id>`), then streams live logs (from Redis pub/sub channel `logs:<id>`) as the build progresses:

```json
{
  "logs": "> my-app@0.1.0 build\n> react-scripts build\nCreating an optimized production build..."
}
```

---

## Authentication

Voltex supports three authentication methods:

- **GitHub OAuth** — OAuth2 flow via `/api/auth/login` (redirects to GitHub), callback at `/api/auth/callback`
- **Google OAuth** — OpenID Connect flow via `/api/auth/google`, callback at `/api/auth/google/callback`
- **Email / Password** — Registration at `/api/auth/email/register`, login at `/api/auth/email/login` (proxied to user-backend, bcrypt-hashed passwords, JWT sessions)

The frontend stores the session in a signed cookie (`auth_token`). The user-backend issues JWTs signed with `JWT_SECRET` (7-day expiry).

---

## Database Schema

The user-backend uses **Prisma ORM** with PostgreSQL:

```prisma
model User {
  id             String   @unique @default(uuid())
  name           String
  username       String   @unique
  email          String?  @unique
  profilePicture String?
  password       String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

Run migrations:

```bash
cd user-backend
npx prisma migrate dev --name init
```

---

## Subdomain Configuration

Use **Nginx** on the host machine to route wildcard subdomains to the request-handler:

```nginx
server {
    listen 80;
    server_name ~^(?<subdomain>[^.]+)\.deploy\.${DOMAIN_NAME}$;

    location / {
        proxy_pass http://localhost:3012;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

For TLS, add SSL certificates (e.g., via Let's Encrypt / Certbot) and update the server block accordingly.

Ensure your DNS provider routes `*.deploy.${DOMAIN_NAME}` to your server's IP address.

---

## Project Structure

```
.
├── docker-compose.yml           # Orchestrates all 8 services
├── .env                         # Root environment variables
├── .env.example                 # Example env template
├── upload-service/              # Express API — accepts deploys, clones repos, uploads to S3
├── deploy-service/              # Background worker — builds projects in Docker, publishes logs
├── request-handler/             # Express reverse-proxy — serves built assets from S3
├── frontend/                    # Voltex dashboard (Next.js 14, Tailwind, Recoil, Framer Motion)
│   ├── src/
│   │   ├── app/                 # App Router (landing, home, login, signup, docs, status)
│   │   ├── app/components/      # Shared UI components
│   │   └── app/home/            # Dashboard tabs (dashboard, deploy, deployments, settings)
│   ├── public/
│   └── .env
├── user-backend/                # Express auth API (Prisma + PostgreSQL)
│   ├── src/
│   │   ├── routes/              # authRoutes.ts, userRoutes.ts
│   │   └── types/               # TypeScript interfaces
│   ├── prisma/
│   │   └── schema.prisma        # User model
│   └── .env
├── ws-server/                   # WebSocket server — live log streaming via Redis pub/sub
│   └── src/
├── shared-output/               # Host-mounted volume for build artifacts
└── docker-bin/                  # Docker binary shim (for local dev environments)
```

---

## Security Notes

- The `.env` files in this repository **contain live credentials** (Cloudflare R2 keys, OAuth secrets). **Rotate these immediately** before deploying or committing to a public repository.
- Change `JWT_SECRET` to a strong, unique value in production.
- The deploy-service mounts the host Docker socket (`/var/run/docker.sock`) — ensure proper access controls are in place.
- The deploy-service runs user-provided code inside Docker containers. Use resource limits and sandboxing for production deployments.

---

## Author

**Mohit Hingorani** — [mohit.systems](https://mohit.systems)

Feel free to contribute or open issues for feature requests or bug reports.
