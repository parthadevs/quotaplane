import { UserResponseDto } from './user-response.dto';

export class LoginResponseDto {
    constructor(
        public readonly accessToken: string,
        public readonly refreshToken: string,
        public readonly user: UserResponseDto,
    ) {}

    public static create(
        accessToken: string,
        refreshToken: string,
        user: UserResponseDto,
    ): LoginResponseDto {
        return new LoginResponseDto(accessToken, refreshToken, user);
    }
}