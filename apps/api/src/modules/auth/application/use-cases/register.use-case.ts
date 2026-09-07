import { Injectable, BadRequestException } from "@nestjs/common";
import { RegisterResponseDto, UserResponseDto } from "../../application/dto/";
import { RegisterRequestDto } from "../../presentation/dtos";
import type { IHashingService } from "../ports/hashing.service.interface";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";
import type { ITokenService } from "../ports/token.service.interface";
import { UserEntity } from "../../domain/entities/user.entity";

@Injectable()
export class RegisterUseCase {
    constructor(
        private readonly userRepository: IUserRepository, 
        private readonly hashingService: IHashingService,
        private readonly tokenService: ITokenService
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

        return RegisterResponseDto.create(
            accessToken,
            refreshToken,
            UserResponseDto.fromEntity(createdUser),
        );
    }
}