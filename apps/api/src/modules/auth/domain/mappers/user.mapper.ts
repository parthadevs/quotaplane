import { UserEntity } from "../../domain/entities/user.entity";
import { UserResponseDto } from "../../application/dto/user-response.dto";

export class UserMapper {

    static toDomain(prismaUser: any): UserEntity {
        return new UserEntity(
            prismaUser.id,
            prismaUser.email,
            prismaUser.passwordHash,
            prismaUser.firstName,
            prismaUser.lastName,
            prismaUser.createdAt,
            prismaUser.updatedAt,
            prismaUser.isEmailVerified,
        );
    }

    static toPersistence(userEntity: UserEntity) {
        return {
            id: userEntity.id,
            email: userEntity.email,
            passwordHash: userEntity.passwordHash,
            firstName: userEntity.firstName,
            lastName: userEntity.lastName,
            isEmailVerified: userEntity.isEmailVerified,
            createdAt: userEntity.createdAt,
            updatedAt: userEntity.updatedAt,
        };
    }

    static toResponseDto(userEntity: UserEntity): UserResponseDto {
        return UserResponseDto.fromEntity(userEntity);
    }
}