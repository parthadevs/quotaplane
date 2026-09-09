import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashingService } from '../../application/ports/hashing.service.interface';
import { ConfigService } from '@app/config';

@Injectable()
export class BcryptHashingService implements IHashingService {
    private readonly saltRounds: number;
    constructor(private readonly configService: ConfigService) {
        this.saltRounds = parseInt(this.configService.get('BCRYPT_SALT_ROUNDS')) || 10;
    }
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}