<!--
# README.md for PaaS Deployment Platform
-->

# ⚙️ PaaS Deployment Platform

A highly scalable **Platform-as-a-Service (PaaS)** solution designed to simplify the deployment of modern frontend applications. By merely providing a GitHub repository URL, the platform will clone, build, and host your application on a custom subdomain.

---

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Getting Started](#getting-started)

   * [Prerequisites](#prerequisites)
   * [Environment Variables](#environment-variables)
   * [Docker Setup](#docker-setup)
4. [API Endpoints](#api-endpoints)

   * [1. Deploy Project](#1-deploy-project)
   * [2. Check Deployment Status](#2-check-deployment-status)
   * [3. Access Deployed Website](#3-access-deployed-website)
5. [Subdomain Configuration](#subdomain-configuration)
6. [Project Structure](#project-structure)
7. [Author](#author)

---

## 🔍 Introduction

This platform enables developers to deploy frontend projects (e.g., React, Vue, Angular) effortlessly by leveraging Git-based workflows. The system automates cloning, building, and hosting processes so you can focus on writing code.

---

## 🧱 Architecture Overview

**Core Components:**

| Service                     | Responsibility                                                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **upload-service**          | Receives GitHub repository URLs, clones the codebase, stages artifacts to S3, and enqueues a deployment job in Redis.                                              |
| **deployment-service**      | Listens to the Redis queue, downloads the repository from S3, executes the build pipeline, and uploads compiled assets to the `dist/` directory in object storage. |
| **request-handler-service** | Routes HTTP requests to appropriate assets in S3 based on the requested subdomain (e.g., `project123.deploy.mohithingorani.tech`).                                 |
| **Nginx** (host)            | Terminates TLS, performs subdomain-based routing, and proxies traffic to the request-handler-service.                                                              |
| **Redis**                   | Acts as the message broker for build jobs and stores deployment statuses.                                                                                          |

---

## 🚀 Getting Started

Follow these instructions to get your PaaS platform up and running locally.

### 🧹 Prerequisites

* **Docker** & **Docker Compose**
* A registered **domain name** (e.g., `mohithingorani.tech`)
* A **wildcard DNS record** (`*.deploy.${DOMAIN_NAME}`) pointed to your server's IP address
* An **S3-compatible object storage** (e.g., AWS S3, DigitalOcean Spaces, MinIO)
* A **Linux-based VM** or server with ports **80** and **443** accessible

### ⚙️ Environment Variables

Create a `.env` file in the project root with the following keys:

```env
# S3 Credentials and Endpoint
accessKeyId=YOUR_ACCESS_KEY
secretAccessKey=YOUR_SECRET_KEY
endpoint=https://your-s3-endpoint.com

# Redis Configuration (optional defaults provided)
redisHost=redis
redisPort=6379

# Domain for routing
DOMAIN_NAME=mohithingorani.tech
```

### 🐳 Docker Setup

Build and start all services in detached mode:

```bash
docker compose up --build -d
```

This command will launch:

* 🚀 **upload-service** on port `3011`
* 🌐 **request-handler-service** on port `3012`
* 🔧 **deployment-service** in the background
* 🗄️ **Redis** on port `6379`

---

## 📡 API Endpoints

### 1. Deploy Project

Initiate a new deployment by sending a POST request:

```http
POST http://upload.${DOMAIN_NAME}/deploy
Content-Type: application/json

{
  "repoUrl": "https://github.com/{username}/{repo}"
}
```

**Response:**

```json
{
  "id": "<unique-deployment-id>"
}
```

---

### 2. Check Deployment Status

Poll the status of an ongoing deployment:

```http
GET http://upload.${DOMAIN_NAME}/status?id=<unique-deployment-id>
```

**Response:**

```json
{
  "id": "<unique-deployment-id>",
  "status": "uploaded | deployed",
  "message": "Informative status message"
}
```

---

### 3. Access Deployed Website

Once the build completes successfully, your application will be available at:

```
http://<unique-deployment-id>.deploy.${DOMAIN_NAME}
```

---

---

## 🚀 Using the PaaS APIs

Leverage these examples to interact with the deployment platform programmatically. All endpoints are scoped under your custom subdomain including **mohithingorani.tech**, reinforcing platform identity:

### Base URLs

* **Upload Service:** `http://upload.mohit-hingorani.tech`
* **Deployment Subdomain:** `http://<id>.deploy.mohithingorani.tech`

### Example: Deploy via cURL

```bash
curl -X POST \
  http://upload.mohit-hingorani.tech/deploy \
  -H "Content-Type: application/json" \
  -d '{"repoUrl":"https://github.com/username/repo"}'
```

**Response:**

```json
{
  "id": "abc123"
}
```

### Example: Check Status via JavaScript (Node.js)

```js
import fetch from 'node-fetch';

async function checkStatus(id) {
  const res = await fetch(`http://upload.mohit-hingorani.tech/status?id=${id}`);
  const json = await res.json();
  console.log(json);
}

checkStatus('abc123');
```

Feel free to replace `mohit-hingorani.tech` with your own domain if you fork the platform.

---

## 🌐 Subdomain Configuration

Use Nginx on the host to route wildcard subdomains to the request-handler-service:

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

Ensure your DNS provider routes the wildcard domain (`*.deploy.${DOMAIN_NAME}`) to your server's IP address.

---

## 📁 Project Structure

```
.
├── docker-compose.yml
├── .env
├── upload-service/
├── deployment-service/
├── request-handler/
└── nginx/             # Host machine configuration
```

---

## 👨‍💻 Author

**Mohit Hingorani** – [mohithingorani.tech](https://mohithingorani.tech)

Feel free to contribute or open issues for any feature requests or bug reports.
