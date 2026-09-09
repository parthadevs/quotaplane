export class RefreshTokenEntity {
  constructor(
    public readonly id: string,
    public readonly tokenHash: string,
    public readonly userId: string,
    public readonly expiresAt: Date,
    public readonly revokedAt: Date | null = null,
  ) {}

  public isExpired(): boolean {
    return this.expiresAt <= new Date();
  }

  public isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  static toDomain(token: {
    id: string;
    tokenHash: string;
    userId: string;
    expiresAt: Date;
    revokedAt: Date | null;
  }): RefreshTokenEntity {
    return new RefreshTokenEntity(
      token.id,
      token.tokenHash,
      token.userId,
      token.expiresAt,
      token.revokedAt,
    );
  }
}
