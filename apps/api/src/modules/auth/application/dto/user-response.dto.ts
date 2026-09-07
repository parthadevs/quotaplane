import { UserEntity } from '../../domain/entities/user.entity';

export class UserResponseDto {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly firstName: string | null,
        public readonly lastName: string | null,
        public readonly isEmailVerified: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {}

    static fromEntity(user: UserEntity): UserResponseDto {
        return new UserResponseDto(
            user.id,
            user.email,
            user.firstName,
            user.lastName,
            user.isEmailVerified,
            user.createdAt,
            user.updatedAt,
        );
    }
}