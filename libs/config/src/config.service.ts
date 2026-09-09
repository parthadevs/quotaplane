import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
    constructor(private readonly nestConfigService: NestConfigService) {}

    get(key: string): string {
        const value = this.nestConfigService.get(key);
        if (!value) {
            throw new Error(`Config value ${key} is not set`);
        }
        return value;
    }
}
