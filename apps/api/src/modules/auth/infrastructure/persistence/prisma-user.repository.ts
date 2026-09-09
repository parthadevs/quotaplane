import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../domain/entities/user.entity";
import { PrismaService } from "@app/prisma";
import { UserMapper } from "../../domain/mappers/user.mapper";
import { IUserRepository } from "../../domain/repositories/user.repository.interface";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(userEntity: UserEntity): Promise<UserEntity> {
        
        const createdUser = await this.prisma.user.create({
            data: {
                id: userEntity.id,
                email: userEntity.email,
                passwordHash: userEntity.passwordHash,
                firstName: userEntity.firstName,
                lastName: userEntity.lastName,
                isEmailVerified: userEntity.isEmailVerified,
                createdAt: userEntity.createdAt,
                updatedAt: userEntity.updatedAt,
            },
        });
        return UserMapper.toDomain(createdUser);
    }

    async findById(id: string): Promise<UserEntity | null> {
        const userModel = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!userModel) {
            return null;
        }
        return UserMapper.toDomain(userModel);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const userModel = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!userModel) {
            return null;
        }
        return UserMapper.toDomain(userModel);
    }

    async update(userEntity: UserEntity): Promise<UserEntity> {
        const updatedModel = await this.prisma.user.update({
            where: { id: userEntity.id },
            data: {
                email: userEntity.email,
                passwordHash: userEntity.passwordHash,
                firstName: userEntity.firstName,
                lastName: userEntity.lastName,
                isEmailVerified: userEntity.isEmailVerified,
                updatedAt: new Date(), 
            },
        });
        return UserMapper.toDomain(updatedModel);
    }
}