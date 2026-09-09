import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService, RefreshTokenPayload } from '../../application/ports/token.service.interface';
import { ConfigService } from '@app/config';
import type { StringValue } from 'ms';
import { createHash, randomUUID } from 'crypto';

@Injectable()
export class JwtTokenService implements ITokenService {
  private readonly accessTokenExpiresIn: StringValue;
  private readonly refreshTokenExpiresIn: StringValue;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiresIn = (this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRES_IN',
    ) || '15m') as StringValue;

    this.refreshTokenExpiresIn = (this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    ) || '7d') as StringValue;
  }

  async generateAccessToken(payload: {
    userId: string;
    email: string;
  }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET') as StringValue,
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  async generateRefreshToken(payload: { userId: string }): Promise<string> {
    return this.jwtService.signAsync({ ...payload, jti: randomUUID() }, {
      secret: this.configService.get('JWT_REFRESH_SECRET') as StringValue,
      expiresIn: this.refreshTokenExpiresIn,
    });
  }

  async verifyAccessToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
    });
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync<RefreshTokenPayload>(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  getRefreshTokenExpiration(token: string): Date {
    const payload = this.jwtService.decode(token);
    if (!payload || typeof payload === 'string' || typeof payload.exp !== 'number') {
      throw new Error('Refresh token has no expiration');
    }

    return new Date(payload.exp * 1000);
  }
}
