import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@app/config';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { QuotasModule } from './modules/quotas/quotas.module';
import { RateLimitsModule } from './modules/rate-limits/rate-limits.module';

@Module({
  imports: [ConfigModule, AuthModule, OrganizationsModule, ApiKeysModule, QuotasModule, RateLimitsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
