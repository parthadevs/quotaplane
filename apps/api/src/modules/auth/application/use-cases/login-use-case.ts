import { Inject, Injectable } from "@nestjs/common";
import { LoginRequestDto } from "../../presentation/dtos/login-request.dto";
import { LoginResponseDto, UserResponseDto } from "../dto";
import type { IHashingService } from "../ports/hashing.service.interface";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";
import type { ITokenService } from "../ports/token.service.interface";
import type { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";
import { UserEntity } from "../../domain/entities/user.entity";
import { RefreshTokenEntity } from "../../domain/entities/refresh-token.entity";

@Injectable()
export class LoginUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('IHashingService') private readonly hashingService: IHashingService,
        @Inject('ITokenService') private readonly tokenService: ITokenService,
        @Inject('IRefreshTokenRepository') private readonly refreshTokenRepository: IRefreshTokenRepository,
    ) {}

    async execute(dto: LoginRequestDto): Promise<LoginResponseDto> {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // if (!user.isEmailVerified) {
        //     throw new Error('Email not verified');
        // }

        const isPasswordValid = await this.hashingService.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const accessToken = await this.tokenService.generateAccessToken({ userId: user.id, email: user.email });
        const refreshToken = await this.tokenService.generateRefreshToken({ userId: user.id });
        await this.refreshTokenRepository.save(new RefreshTokenEntity(
            crypto.randomUUID(),
            this.tokenService.hashRefreshToken(refreshToken),
            user.id,
            this.tokenService.getRefreshTokenExpiration(refreshToken),
        ));
        return {
            accessToken,
            refreshToken,
            user: UserResponseDto.fromEntity(user),
        };
    }
}
