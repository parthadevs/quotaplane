# Router Map

```
POST /v1/auth/register
POST /v1/auth/login

POST /v1/organizations
GET  /v1/organizations/:id

POST /v1/organizations/:id/api-keys
GET  /v1/organizations/:id/api-keys

GET  /v1/organizations/:id/quota
GET  /v1/organizations/:id/usage

POST /v1/quota/check

GET /health
```
```
/v2
│
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   ├── POST   /refresh
│   ├── POST   /logout
│   └── GET    /me
│
├── /organizations
│   ├── POST   /
│   ├── GET    /
│   ├── GET    /:organizationId
│   ├── PATCH  /:organizationId
│   └── DELETE /:organizationId
│
├── /organizations/:organizationId
│   │
│   ├── /members
│   │   ├── GET
│   │   ├── POST
│   │   ├── PATCH /:memberId
│   │   └── DELETE /:memberId
│   │
│   ├── /api-keys
│   │   ├── GET
│   │   ├── POST
│   │   └── ...
│   │
│   ├── /quota
│   │   ├── GET
│   │   ├── PATCH
│   │   └── POST /reset
│   │
│   ├── /usage
│   │   ├── GET
│   │   ├── /summary
│   │   ├── /timeline
│   │   ├── /by-key
│   │   └── /by-endpoint
│   │
│   ├── /rate-limits
│   │   ├── GET
│   │   ├── POST
│   │   ├── PATCH /:id
│   │   └── DELETE /:id
│   │
│   ├── /fairness
│   │   └── GET
│   │
│   └── /webhooks
│       ├── GET
│       ├── POST
│       ├── PATCH /:id
│       └── DELETE /:id
│
├── /quota
│   ├── POST /check
│   ├── POST /reserve
│   ├── POST /commit
│   └── POST /release
│
├── /rate-limit
│   └── POST /check
│
└── /health
    ├── GET /
    ├── GET /redis
    └── GET /database
```