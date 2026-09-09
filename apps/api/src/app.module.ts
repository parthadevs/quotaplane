import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@app/config';

@Module({
  imports: [ConfigModule,AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
