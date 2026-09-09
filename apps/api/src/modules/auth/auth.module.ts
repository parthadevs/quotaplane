import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@app/config';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { PrismaModule } from '@app/prisma';
import { LoginUseCase } from './application/use-cases/login-use-case';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { PrismaRefreshToken } from './infrastructure/persistence/prisma-refresh-token.repository';
import { BcryptHashingService } from './infrastructure/services/hashing-service';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { RefreshUseCase } from './application/use-cases/refresh.use-case';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [ConfigModule, PrismaModule, JwtModule.register({})],
  controllers : [AuthController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'IRefreshTokenRepository',
      useClass: PrismaRefreshToken,
    },
    {
      provide: 'IHashingService',
      useClass: BcryptHashingService,
    },
    {
      provide: 'ITokenService',
      useClass: JwtTokenService,
    },
    LoginUseCase,
    RegisterUseCase,
    LogoutUseCase,
    RefreshUseCase
  ],
  exports : [AuthModule]
})
export class AuthModule {}
