import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma';
import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity';
import { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";

@Injectable()
export class PrismaRefreshToken implements IRefreshTokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
        const token = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
        return token ? RefreshTokenEntity.toDomain(token) : null;
    }

    async save(refreshToken: RefreshTokenEntity): Promise<RefreshTokenEntity> {
        const token = await this.prisma.refreshToken.create({
            data: {
                id: refreshToken.id,
                userId: refreshToken.userId,
                tokenHash: refreshToken.tokenHash,
                expiresAt: refreshToken.expiresAt,
                revokedAt: refreshToken.revokedAt,
            },
        });
        return RefreshTokenEntity.toDomain(token);
    }

    async revoke(id: string): Promise<void> {
        await this.prisma.refreshToken.update({
            where: { id },
            data: { revokedAt: new Date() },
        });
    }

    async revokeAllForUser(userId: string): Promise<void> {
        await this.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }

}
