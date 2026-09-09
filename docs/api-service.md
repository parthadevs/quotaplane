```
apps/api/
└── src/
    ├── main.ts
    │
    ├── app.module.ts
    │
    ├── common/
    │   ├── decorators/
    │   ├── guards/
    │   ├── filters/
    │   ├── interceptors/
    │   ├── pipes/
    │   └── middleware/
    │
    ├── modules/
    │   │
    │   ├── auth/
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   ├── auth.module.ts
    │   │   └── dto/
    │   │
    │   ├── organizations/
    │   │   ├── organizations.controller.ts
    │   │   ├── organizations.service.ts
    │   │   ├── organizations.module.ts
    │   │   └── dto/
    │   │
    │   ├── api-keys/
    │   │   ├── api-keys.controller.ts
    │   │   ├── api-keys.service.ts
    │   │   ├── api-keys.module.ts
    │   │   └── dto/
    │   │
    │   ├── quotas/
    │   │   ├── quotas.controller.ts
    │   │   ├── quotas.service.ts
    │   │   ├── quotas.module.ts
    │   │   ├── quota-engine.service.ts
    │   │   ├── quota.repository.ts
    │   │   ├── lua/
    │   │   │   ├── deduct-quota.lua
    │   │   │   ├── reserve-quota.lua
    │   │   │   └── release-quota.lua
    │   │   └── dto/
    │   │
    │   ├── rate-limits/
    │   │   ├── rate-limits.controller.ts
    │   │   ├── rate-limits.service.ts
    │   │   ├── rate-limits.module.ts
    │   │   └── dto/
    │   │
    │   ├── usage/
    │   │   ├── usage.controller.ts
    │   │   ├── usage.service.ts
    │   │   ├── usage.module.ts
    │   │   └── dto/
    │   │
    │   ├── fairness/
    │   │   ├── fairness.service.ts
    │   │   ├── weighted-allocation.service.ts
    │   │   └── fairness.module.ts
    │   │
    │   ├── health/
    │   │   ├── health.controller.ts
    │   │   └── health.module.ts
    │   │
    │   └── webhooks/
    │       ├── webhooks.controller.ts
    │       ├── webhooks.service.ts
    │       └── webhooks.module.ts
    │
    └── infrastructure/
        ├── redis/
        ├── prisma/
        └── events/
```