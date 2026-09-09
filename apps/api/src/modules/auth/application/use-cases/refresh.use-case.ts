import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { RefreshRequestDto } from "../../presentation/dtos";
import type { ITokenService } from '../ports/token.service.interface';
import type { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity';
import { LoginResponseDto, UserResponseDto } from '../dto';

@Injectable()
export class RefreshUseCase {
    constructor(
        @Inject('ITokenService') private readonly tokenService: ITokenService,
        @Inject('IRefreshTokenRepository') private readonly refreshTokenRepository: IRefreshTokenRepository,
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    ) {}

    async execute(input: RefreshRequestDto): Promise<LoginResponseDto> {
        let payload: { userId: string };
        try {
            payload = await this.tokenService.verifyRefreshToken(input.refreshToken);
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const storedToken = await this.refreshTokenRepository.findByTokenHash(
            this.tokenService.hashRefreshToken(input.refreshToken),
        );
        if (!storedToken || storedToken.userId !== payload.userId || storedToken.isRevoked() || storedToken.isExpired()) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const user = await this.userRepository.findById(payload.userId);
        if (!user) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        await this.refreshTokenRepository.revoke(storedToken.id);
        const accessToken = await this.tokenService.generateAccessToken({ userId: user.id, email: user.email });
        const refreshToken = await this.tokenService.generateRefreshToken({ userId: user.id });
        await this.refreshTokenRepository.save(new RefreshTokenEntity(
            crypto.randomUUID(),
            this.tokenService.hashRefreshToken(refreshToken),
            user.id,
            this.tokenService.getRefreshTokenExpiration(refreshToken),
        ));

        return LoginResponseDto.create(accessToken, refreshToken, UserResponseDto.fromEntity(user));
    }
}
