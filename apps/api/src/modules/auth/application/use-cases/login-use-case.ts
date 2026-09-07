import { Injectable } from "@nestjs/common";
import { LoginRequestDto } from "../../presentation/dtos/login-request.dto";
import { LoginResponseDto, UserResponseDto } from "../dto";
import type { IHashingService } from "../ports/hashing.service.interface";
import type { IUserRepository } from "../../domain/repositories/user.repository.interface";
import type { ITokenService } from "../ports/token.service.interface";

@Injectable()
export class LoginUseCase {
    constructor(
        private readonly userRepository: IUserRepository, 
        private readonly hashingService: IHashingService,
        private readonly tokenService: ITokenService
    ) {}

    async execute(dto: LoginRequestDto): Promise<LoginResponseDto> {
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (!user.isEmailVerified) {
            throw new Error('Email not verified');
        }

        const isPasswordValid = await this.hashingService.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        const accessToken = await this.tokenService.generateAccessToken({ userId: user.id, email: user.email });
        const refreshToken = await this.tokenService.generateRefreshToken({ userId: user.id });
        return {
            accessToken,
            refreshToken,
            user: UserResponseDto.fromEntity(user),
        };
    }
}