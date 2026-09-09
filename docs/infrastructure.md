```
quotaplane/
├── apps/
│   ├── api/
│   ├── worker/
│   └── dashboard/
│
├── packages/
│   ├── config/
│   ├── database/
│   ├── redis/
│   ├── common/
│   ├── logger/
│   └── sdk/
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.worker
│   │   └── Dockerfile.dashboard
│   │
│   ├── nginx/
│   │   └── nginx.conf
│   │
│   └── prometheus/
│       └── prometheus.yml
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── scripts/
│   ├── seed.ts
│   └── load-test.ts
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md
```