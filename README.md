# QuotaPlane

### Distributed Shared Quota & Rate Limiting Infrastructure

**QuotaPlane** is a backend infrastructure service for managing **shared API quotas, rate limits, API keys, usage tracking, and weighted fairness** across multiple applications and API keys.

Instead of assigning an isolated quota to every API key, QuotaPlane allows multiple keys belonging to the same organization to consume a **shared quota pool**.

> **One quota plane. Multiple API keys. Fair usage.**

---
## Project Overview
<div align="center">
<img src="./screenshot/ide-project-overview.png" style="border-radius:10px" alt="B+ Tree insert operation step-through" width="100%" />

</div>

## Project Status

### WORKING ( Active Development )

QuotaPlane is a **working backend project** currently under active development.

The core backend architecture, authentication system, organization structure, API-key management, PostgreSQL/Prisma integration, Redis infrastructure, quota management, rate-limiting modules, usage tracking, fairness, webhooks, and background-worker architecture are being developed as a production-oriented system.

Some advanced infrastructure features may continue to evolve as the project moves toward production scale.

---

# Problem

Traditional API rate limiting often works like this:

```text
API Key A → 1,000 requests
API Key B → 1,000 requests
API Key C → 1,000 requests
```

The problem is that unused quota can be wasted.

For example:

```text
Production → 900 / 1,000
Mobile     → 200 / 1,000
Analytics  → 100 / 1,000
```

Meanwhile, another key may need more capacity.

QuotaPlane solves this using a **shared organization-level quota pool**:

```text
                    Organization
                         │
                  Shared Quota
                   10,000 units
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      Production       Mobile       Analytics
       Weight: 5       Weight: 3       Weight: 1
```

All API keys consume from the same quota pool while weighted fairness can prioritize more important workloads.

---

# Features

## Authentication

* User registration
* User login
* JWT access tokens
* Refresh tokens
* Logout
* Password hashing
* Authentication guards
* Clean Architecture based authentication
* Repository abstraction
* Prisma persistence

---

## Organizations

Organizations represent teams, companies, or applications using QuotaPlane.

Each organization can have:

* Multiple users
* Multiple API keys
* Shared quota
* Rate-limit rules
* Usage records
* Webhooks
* Audit history

Example:

```text
Acme Inc.
│
├── Production API
├── Mobile API
├── Analytics API
└── Internal API
```

---

# API Key Management

Organizations can create multiple API keys.

Example:

```text
qpl_live_prod_xxxxxxxxx
qpl_live_mobile_xxxxxxx
qpl_live_analytics_xxxx
```

Each key can have:

* Name
* Status
* Weight
* Expiration
* Last-used timestamp
* Organization ownership

### Security

Raw API keys should not be stored permanently.

QuotaPlane stores a secure hash of the API key and uses the key prefix for identification and dashboard visibility.

---

# Shared Quota

QuotaPlane provides organization-level quota management.

Example:

```text
Monthly Quota
────────────────────────

Limit      : 10,000
Used       : 6,450
Remaining  : 3,550
```

Multiple API keys consume from the same quota:

```text
Organization Quota
        │
        ├── Production
        ├── Mobile
        └── Analytics
```

This prevents unused per-key capacity from being unnecessarily locked.

---

# Redis-Based Real-Time Quota

QuotaPlane uses **Redis** for fast-changing quota state.

PostgreSQL acts as the durable source of truth, while Redis handles high-frequency runtime operations.

```text
                    Request
                       │
                       ▼
                 QuotaPlane API
                       │
                       ▼
                     Redis
                       │
              Atomic quota check
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
          Allowed             Rejected
```

Quota deduction can be performed atomically using Redis operations/Lua scripts to prevent race conditions.

Example:

```text
Request A ──┐
Request B ──┼──→ Redis Atomic Operation
Request C ──┘
```

This is important when many requests arrive concurrently.

---

# Rate Limiting

QuotaPlane separates:

### Rate Limit

Controls short-term request frequency.

Example:

```text
100 requests / 60 seconds
```

### Quota

Controls total usage for a billing/usage period.

Example:

```text
100,000 requests / month
```

Therefore:

```text
Rate Limit
    ↓
"How fast can you use it?"

Quota
    ↓
"How much can you use in total?"
```

Supported rate-limit algorithm architecture:

* Fixed Window
* Sliding Window
* Token Bucket

---

# Weighted Fairness

Different API keys can have different priorities.

Example:

```text
Production  → Weight 5
Mobile      → Weight 3
Analytics   → Weight 1
```

This allows the system to prioritize important workloads.

The goal is **not** to permanently divide the quota into fixed sections.

Instead:

```text
Shared Quota
     │
     ├── Production  █████
     ├── Mobile      ███
     └── Analytics   █
```

Unused capacity can still be consumed by other keys.

---

# Usage Tracking

QuotaPlane records usage information such as:

* Organization
* API key
* Endpoint
* HTTP method
* Request cost
* Request status
* Remaining quota
* Rejection reason
* IP address
* User agent
* Timestamp

Example:

```text
Production API

Requests       45,230
Successful     44,980
Rejected          250
Quota Used      45,230
```

Usage data can later power:

* Dashboard analytics
* Usage reports
* Billing
* Monitoring
* Fraud detection
* Cost analysis

---

# Webhooks

Organizations can configure webhooks for important events.

Example events:

```text
quota.warning
quota.exceeded
api_key.created
api_key.revoked
rate_limit.exceeded
```

Webhook delivery architecture supports:

* Delivery tracking
* Retry attempts
* Response status
* Failed delivery handling
* Next retry scheduling

---

# Background Worker

QuotaPlane includes a dedicated worker application.

The worker is intended for operations that should not block API requests.

Examples:

```text
API
 │
 ├── Validate request
 ├── Check quota
 └── Return response
          │
          ▼
        Queue
          │
          ▼
        Worker
          │
          ├── Usage aggregation
          ├── Quota reset
          ├── Webhook delivery
          └── Cleanup
```

This keeps latency-sensitive API operations separate from background processing.

---

# Architecture

QuotaPlane currently follows a modular monorepo architecture.

```text
                    ┌─────────────────┐
                    │    Dashboard    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    NestJS API   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌───────────┐ ┌────────────┐ ┌────────────┐
        │PostgreSQL │ │   Redis    │ │   Events   │
        │           │ │            │ │            │
        │Permanent  │ │Real-time   │ │Async       │
        │Data       │ │State       │ │Processing  │
        └───────────┘ └────────────┘ └─────┬──────┘
                                           │
                                           ▼
                                    ┌─────────────┐
                                    │   Worker    │
                                    └─────────────┘
```

---

# Architecture Principles

The API application follows principles inspired by:

* Clean Architecture
* SOLID
* Dependency Inversion
* Repository Pattern
* Domain-driven separation
* Infrastructure isolation

The authentication module is structured into:

```text
auth/
├── application/
├── domain/
├── infrastructure/
└── presentation/
```

### Domain

Contains business concepts and abstractions.

```text
entities/
repositories/
types/
mappers/
```

### Application

Contains use cases and application-level contracts.

```text
dto/
ports/
use-cases/
types/
```

### Infrastructure

Contains implementations that depend on external technologies.

```text
persistence/
services/
strategies/
```

### Presentation

Contains HTTP-facing components.

```text
controllers/
dtos/
guards/
filters/
```

This keeps business logic independent from frameworks and infrastructure details.

---

# Project Structure

```text
quotaplane/
│
├── apps/
│   │
│   ├── api/
│   │   ├── src/
│   │   │   ├── infrastructure/
│   │   │   │   ├── events/
│   │   │   │   ├── prisma/
│   │   │   │   └── redis/
│   │   │   │
│   │   │   ├── modules/
│   │   │   │   │
│   │   │   │   ├── api-keys/
│   │   │   │   │
│   │   │   │   ├── auth/
│   │   │   │   │   ├── application/
│   │   │   │   │   │   ├── dto/
│   │   │   │   │   │   ├── ports/
│   │   │   │   │   │   ├── types/
│   │   │   │   │   │   └── use-cases/
│   │   │   │   │   │
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── mappers/
│   │   │   │   │   │   ├── repositories/
│   │   │   │   │   │   └── types/
│   │   │   │   │   │
│   │   │   │   │   ├── infrastructure/
│   │   │   │   │   │   ├── persistence/
│   │   │   │   │   │   ├── services/
│   │   │   │   │   │   └── strategies/
│   │   │   │   │   │
│   │   │   │   │   └── presentation/
│   │   │   │   │       ├── controllers/
│   │   │   │   │       ├── dtos/
│   │   │   │   │       ├── filters/
│   │   │   │   │       └── guards/
│   │   │   │   │
│   │   │   │   ├── fairness/
│   │   │   │   ├── health/
│   │   │   │   ├── organizations/
│   │   │   │   ├── quotas/
│   │   │   │   ├── rate-limits/
│   │   │   │   ├── usage/
│   │   │   │   └── webhooks/
│   │   │   │
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   └── app.service.ts
│   │   │
│   │   └── test/
│   │
│   ├── dashboard/
│   │   ├── src/
│   │   └── test/
│   │
│   └── worker/
│       ├── src/
│       └── test/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── packages/
│   ├── common/
│   ├── config/
│   ├── database/
│   ├── logger/
│   ├── redis/
│   └── sdk/
│
├── infrastructure/
│   ├── docker/
│   ├── nginx/
│   └── prometheus/
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

# Database Architecture

QuotaPlane uses **PostgreSQL** as the primary persistent database.

Important entities include:

```text
User
Organization
OrganizationMember
ApiKey
Quota
RateLimitRule
UsageRecord
Webhook
WebhookDelivery
AuditLog
RefreshToken
```

PostgreSQL is responsible for durable business data.

---

# Redis Architecture

Redis is used for high-speed temporary/runtime data.

Examples:

```text
Quota counters
Rate-limit counters
API-key cache
Idempotency keys
Distributed locks
Temporary state
```

Example Redis structure:

```text
quota:org:{organizationId}
ratelimit:{organizationId}:{keyId}
apikey:{keyHash}
idempotency:{requestId}
```

---

# Docker

Development infrastructure runs through Docker Compose.

Current core services:

```text
PostgreSQL
Redis
```

Example:

```bash
docker compose up -d
```

Check services:

```bash
docker compose ps
```

Stop services:

```bash
docker compose down
```

Persistent data is stored using Docker volumes.

---

# API

Base URL during development:

```text
http://localhost:3000
```

API version:

```text
/v1
```

---

## Authentication

### Register

```http
POST /v1/auth/register
```

### Login

```http
POST /v1/auth/login
```

### Refresh Token

```http
POST /v1/auth/refresh
```

### Logout

```http
POST /v1/auth/logout
```

### Current User

```http
GET /v1/auth/me
```

---

# Organizations

### Create Organization

```http
POST /v1/organizations
```

### Get Organization

```http
GET /v1/organizations/:organizationId
```

### Update Organization

```http
PATCH /v1/organizations/:organizationId
```

### Delete Organization

```http
DELETE /v1/organizations/:organizationId
```

---

# API Keys

### Create API Key

```http
POST /v1/organizations/:organizationId/api-keys
```

### List API Keys

```http
GET /v1/organizations/:organizationId/api-keys
```

### Get API Key

```http
GET /v1/organizations/:organizationId/api-keys/:keyId
```

### Update API Key

```http
PATCH /v1/organizations/:organizationId/api-keys/:keyId
```

### Revoke API Key

```http
DELETE /v1/organizations/:organizationId/api-keys/:keyId
```

### Rotate API Key

```http
POST /v1/organizations/:organizationId/api-keys/:keyId/rotate
```

---

# Quota API

The most important endpoint is:

```http
POST /v1/quota/check
```

Example request:

```json
{
  "cost": 1
}
```

Example response:

```json
{
  "allowed": true,
  "cost": 1,
  "remaining": 9999,
  "limit": 10000
}
```

When quota is exceeded:

```json
{
  "allowed": false,
  "reason": "QUOTA_EXCEEDED",
  "limit": 10000,
  "used": 10000,
  "remaining": 0
}
```

---

# Request Flow

A typical customer integration looks like:

```text
Customer Application
        │
        │ API Request
        ▼
Customer Backend
        │
        │ Quota Check
        ▼
QuotaPlane
        │
        ▼
API Key Validation
        │
        ▼
Organization Lookup
        │
        ▼
Redis Atomic Quota Check
        │
        ├───────────────┐
        ▼               ▼
     Allowed         Rejected
        │               │
        ▼               ▼
Continue Request      HTTP 429
```

---

# Usage Flow

High-frequency request handling should avoid writing every counter update directly to PostgreSQL.

Conceptually:

```text
Request
  │
  ▼
Redis
  │
  ├── Atomic quota deduction
  └── Runtime counter
          │
          ▼
        Queue
          │
          ▼
        Worker
          │
          ▼
     PostgreSQL
```

This reduces unnecessary database write pressure.

---

# Testing

The project includes unit and end-to-end testing structure.

Run tests:

```bash
pnpm test
```

Run test coverage:

```bash
pnpm test:cov
```

Run E2E tests:

```bash
pnpm test:e2e
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
NODE_ENV=development

APP_NAME=QuotaPlane
APP_VERSION=1.0.0
API_VERSION=v1
PORT=3000

POSTGRES_USER=quotaplane
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=quotaplane
POSTGRES_PORT=5432

DATABASE_URL="postgresql://quotaplane:your_postgres_password@localhost:5432/quotaplane?schema=public"

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

API_KEY_PREFIX=qpl_live
API_KEY_HASH_ALGORITHM=sha256

CORS_ORIGIN=http://localhost:3001

LOG_LEVEL=debug
```

> Never commit `.env` or real secrets to Git.

---

# Getting Started

## 1. Clone

```bash
git clone https://github.com/parthadevs/quotaplane.git

cd quotaplane
```

---

## 2. Install Dependencies

Using pnpm:

```bash
pnpm install
```

---

## 3. Configure Environment

Create:

```text
.env
```

and add the required environment variables.

---

## 4. Start Infrastructure

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

Verify:

```bash
docker compose ps
```

---

## 5. Generate Prisma Client

```bash
pnpm prisma generate
```

---

## 6. Run Database Migration

Development:

```bash
pnpm prisma migrate dev
```

---

## 7. Start API

```bash
pnpm start:dev
```

The API will run on:

```text
http://localhost:3000
```

---

## 8. Start Worker

```bash
pnpm start:worker
```

---

## 9. Start Dashboard

```bash
pnpm start:dashboard
```

---

# Tech Stack

## Backend

* Node.js
* NestJS
* TypeScript

## Database

* PostgreSQL
* Prisma ORM

## Caching

* Redis

## Background Processing

* BullMQ
* Redis

## Authentication

* JWT
* Refresh Tokens
* Password Hashing

## Architecture

* Clean Architecture
* SOLID
* Repository Pattern
* Dependency Inversion
* Modular Monolith Architecture

## Infrastructure

* Docker
* Docker Compose
* Nginx
* Prometheus

## Package Management

* pnpm

---

# Security

QuotaPlane is designed with security in mind.

### API Keys

API keys are hashed before persistent storage.

### Authentication

JWT access and refresh token architecture is used for user authentication.

### Redis

Redis authentication should be enabled in production.

### Environment Secrets

Secrets are provided through environment variables instead of source code.

### Organization Isolation

Organization-owned resources are scoped through organization IDs to prevent cross-organization access.

### Rate Limiting

Rate limiting helps protect APIs from excessive request traffic.

---

# Design Decisions

## Why PostgreSQL?

PostgreSQL is used for durable relational data such as:

```text
Users
Organizations
API Keys
Quotas
Usage
Webhooks
Audit Logs
```

It provides:

* Transactions
* Referential integrity
* Strong consistency
* Indexing
* Reliable persistence

---

## Why Redis?

Quota and rate-limit operations can happen at very high frequency.

Redis provides:

* Low latency
* Atomic operations
* Counters
* TTL
* Distributed locks
* Lua scripting
* High-throughput runtime state

---

## Why not separate databases for every service?

QuotaPlane starts as a modular system rather than immediately introducing distributed microservices.

Current approach:

```text
                    QuotaPlane
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
         PostgreSQL             Redis
```

This keeps:

* Development simpler
* Transactions easier
* Data consistency easier
* Deployment simpler
* Operational overhead lower

As the system grows, individual services can be separated when there is a real scaling or ownership requirement.

---

# Future Architecture

At larger scale, the system can evolve toward:

```text
                    API Gateway
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    Auth Service   Quota Service   Usage Service
          │              │              │
         DB             DB             DB
                         │
                       Redis
                         │
                       Kafka
                         │
                    Event Stream
```

Potential future technologies:

* Kafka
* Kubernetes
* PostgreSQL partitioning
* Read replicas
* Distributed workers
* Horizontal API scaling
* Prometheus + Grafana
* OpenTelemetry
* Dedicated analytics storage

These are future scaling options rather than requirements for the current V1 architecture.

---

# Roadmap

## Phase 1 — Core Infrastructure

* [x] Monorepo structure
* [x] NestJS API application
* [x] PostgreSQL integration
* [x] Prisma integration
* [x] Redis integration
* [x] Docker development environment
* [x] Authentication architecture

## Phase 2 — Identity & Organizations

* [x] User model
* [x] Organization model
* [x] Organization members
* [x] Role-based access structure
* [x] API key model

## Phase 3 — Quota Engine

* [ ] Shared organization quota
* [ ] Redis atomic deduction
* [ ] Quota reset
* [ ] Request cost system
* [ ] Idempotency protection
* [ ] Quota reservation/commit/release

## Phase 4 — Rate Limiting

* [ ] Fixed Window
* [ ] Sliding Window
* [ ] Token Bucket
* [ ] Per-key limits
* [ ] Endpoint-specific limits

## Phase 5 — Usage & Fairness

* [ ] Usage aggregation
* [ ] Usage analytics
* [ ] Weighted fairness engine
* [ ] Per-key usage dashboard
* [ ] Endpoint usage analytics

## Phase 6 — Async Infrastructure

* [ ] BullMQ workers
* [ ] Usage aggregation jobs
* [ ] Webhook delivery queue
* [ ] Retry / dead-letter handling
* [ ] Scheduled quota reset

## Phase 7 — Production Infrastructure

* [ ] Prometheus metrics
* [ ] Grafana dashboards
* [ ] OpenTelemetry
* [ ] Docker production deployment
* [ ] Horizontal API scaling
* [ ] Load testing
* [ ] Kubernetes deployment

---

# Example Use Case

Imagine a company has:

```text
Monthly quota = 100,000 units
```

and three API keys:

```text
Production  → Weight 5
Mobile      → Weight 3
Analytics   → Weight 1
```

Instead of:

```text
Production → 33,333
Mobile     → 33,333
Analytics  → 33,334
```

QuotaPlane provides a shared pool:

```text
                  100,000
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
   Production      Mobile      Analytics
      5x             3x             1x
```

If Analytics is not using its capacity, Production can continue consuming from the shared pool.

This improves overall resource utilization.

---

# Future SDK

QuotaPlane can provide an SDK for easy integration.

Example:

```ts
import { QuotaPlane } from "@quotaplane/sdk";

const quotaPlane = new QuotaPlane({
  apiKey: process.env.QUOTAPLANE_API_KEY,
});

const result = await quotaPlane.check({
  cost: 1,
});

if (!result.allowed) {
  return res.status(429).json({
    message: "Quota exceeded",
  });
}
```

The SDK is intended to make QuotaPlane easy to integrate into Node.js/TypeScript applications.

---

# Direct API Integration

Customers can also integrate without the SDK.

```http
POST /v1/quota/check
Authorization: Bearer qpl_live_xxxxxxxxx
Content-Type: application/json
```

Request:

```json
{
  "cost": 1
}
```

Response:

```json
{
  "allowed": true,
  "cost": 1,
  "remaining": 9999,
  "limit": 10000
}
```

---

# Engineering Goals

QuotaPlane is designed around several engineering goals:

### Low Latency

Runtime quota decisions should happen in Redis rather than requiring a database transaction for every request.

### Atomicity

Concurrent quota requests must not accidentally consume the same quota multiple times.

### Reliability

Persistent configuration and historical data live in PostgreSQL.

### Scalability

API, worker, Redis, and PostgreSQL can independently scale as traffic grows.

### Maintainability

Business logic should remain independent from framework and infrastructure details.

### Observability

Usage, health, logs, metrics, and audit events should provide visibility into the system.

---

# Current System

```text
┌─────────────────────────────────────────────────────┐
│                     QuotaPlane                      │
│                                                     │
│  ┌─────────────┐        ┌────────────────────────┐ │
│  │     API     │───────▶│      PostgreSQL        │ │
│  │   NestJS    │        │        Prisma          │ │
│  └──────┬──────┘        └────────────────────────┘ │
│         │                                           │
│         │                                           │
│         ▼                                           │
│  ┌─────────────┐        ┌────────────────────────┐ │
│  │    Redis    │◀──────▶│        Worker          │ │
│  │   Runtime   │        │       BullMQ           │ │
│  └─────────────┘        └────────────────────────┘ │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

# Contributing

Contributions, ideas, bug reports, and improvements are welcome.

Typical workflow:

```bash
git checkout -b feature/your-feature

git add .

git commit -m "feat: add your feature"

git push origin feature/your-feature
```

Then open a Pull Request.

---

# License

This project is currently under active development.

License information will be added before the first public release.

---

# Author

**Partha Sarker**

Backend Engineer focused on:

* Node.js
* NestJS
* TypeScript
* PostgreSQL
* Redis
* Distributed Systems
* Clean Architecture
* System Design

GitHub:

```text
https://github.com/parthadevs
```

---

# Project Vision

QuotaPlane aims to become a developer-focused infrastructure platform for:

> **Shared quotas, intelligent rate limiting, usage analytics, and fair resource allocation.**

The long-term goal is to make quota management as simple as:

```text
Create Organization
        ↓
Create API Keys
        ↓
Configure Shared Quota
        ↓
Connect SDK
        ↓
QuotaPlane Handles
    ├── Quota
    ├── Rate Limits
    ├── Fairness
    ├── Usage
    └── Webhooks
```

**One quota plane. Multiple API keys. Fair usage.**
