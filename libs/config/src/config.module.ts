import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigModule as ConfigModuleM } from '@nestjs/config';

@Module({
  imports : [ConfigModuleM.forRoot({
    isGlobal : true
  })],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
