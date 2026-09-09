import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { RegisterResponseDto, UserResponseDto } from "../../application/dto/";
import { RegisterRequestDto } from "../../presentation/dtos";
import type { IHashingService } from "../ports/hashing.service.interface";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";
import type { ITokenService } from "../ports/token.service.interface";
import type { IRefreshTokenRepository } from "../../domain/repositories/refresh-token.repository.interface";
import { UserEntity } from "../../domain/entities/user.entity";
import { RefreshTokenEntity } from "../../domain/entities/refresh-token.entity";

@Injectable()
export class RegisterUseCase {
    constructor(
        @Inject('IUserRepository') private readonly userRepository: IUserRepository,
        @Inject('IHashingService') private readonly hashingService: IHashingService,
        @Inject('ITokenService') private readonly tokenService: ITokenService,
        @Inject('IRefreshTokenRepository') private readonly refreshTokenRepository: IRefreshTokenRepository,
    ) {}

    async execute(dto: RegisterRequestDto): Promise<RegisterResponseDto> {
        const existingUser = await this.userRepository.findByEmail(dto.email);

        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        const passwordHash = await this.hashingService.hash(dto.password);

        const newUser = new UserEntity(
            crypto.randomUUID(),
            dto.email,
            passwordHash,
            dto.firstName || null,
            dto.lastName || null,
            new Date(),
            new Date(),
            false, 
        );

        const createdUser = await this.userRepository.create(newUser);

        const accessToken = await this.tokenService.generateAccessToken({ userId: createdUser.id, email: createdUser.email });
        const refreshToken = await this.tokenService.generateRefreshToken({ userId: createdUser.id });
        
        await this.refreshTokenRepository.save(new RefreshTokenEntity(
            crypto.randomUUID(),
            this.tokenService.hashRefreshToken(refreshToken),
            createdUser.id,
            this.tokenService.getRefreshTokenExpiration(refreshToken),
        ));

        return RegisterResponseDto.create(
            accessToken,
            refreshToken,
            UserResponseDto.fromEntity(createdUser),
        );
    }
}
