import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@app/config';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ApiKeysModule } from './modules/api-keys/api-keys.module';
import { QuotasModule } from './modules/quotas/quotas.module';

@Module({
  imports: [ConfigModule, AuthModule, OrganizationsModule, ApiKeysModule, QuotasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
