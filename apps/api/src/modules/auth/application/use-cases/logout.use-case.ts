import { Inject, Injectable } from "@nestjs/common";
import type { ITokenService } from '../ports/token.service.interface';
import type { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';

@Injectable()
export class LogoutUseCase {
    constructor(
        @Inject('ITokenService') private readonly tokenService: ITokenService,
        @Inject('IRefreshTokenRepository') private readonly refreshTokenRepository: IRefreshTokenRepository,
    ) {}

    async execute(token: string) {
        const storedToken = await this.refreshTokenRepository.findByTokenHash(
            this.tokenService.hashRefreshToken(token),
        );
        if (storedToken && !storedToken.isRevoked()) {
            await this.refreshTokenRepository.revoke(storedToken.id);
        }

        return { message: 'Logged out successfully.' };
    }

}
