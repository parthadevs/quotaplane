import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export interface IRefreshTokenRepository {
  findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null>;
  save(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity>;
  revoke(id: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}