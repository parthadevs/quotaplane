import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@app/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    let host = 'localhost';
    let port = 6379;
    let password: string | undefined = undefined;

    try {
      host = this.configService.get('REDIS_HOST') || 'localhost';
    } catch {
      host = process.env.REDIS_HOST || 'localhost';
    }

    try {
      port = parseInt(this.configService.get('REDIS_PORT'), 10) || 6379;
    } catch {
      port = parseInt(process.env.REDIS_PORT || '6379', 10);
    }

    try {
      password = this.configService.get('REDIS_PASSWORD');
    } catch {
      password = process.env.REDIS_PASSWORD || undefined;
    }

    this.client = new Redis({
      host,
      port,
      password: password || undefined,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (ttlSeconds) {
      return this.client.set(key, value, 'EX', ttlSeconds);
    }
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async incrBy(key: string, amount: number): Promise<number> {
    return this.client.incrby(key, amount);
  }

  async decrBy(key: string, amount: number): Promise<number> {
    return this.client.decrby(key, amount);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }

  /**
   * Atomic quota consumption using Redis Lua Script.
   * Checks if used + cost <= limit. If yes, increments used and returns remaining.
   * If no, returns -1 (rejected).
   */
  async consumeQuota(key: string, cost: number, limit: number, ttlSeconds: number): Promise<{ allowed: boolean; remaining: number }> {
    const luaScript = `
      local current = redis.call('GET', KEYS[1])
      local used = 0
      if current then
        used = tonumber(current)
      end
      local cost = tonumber(ARGV[1])
      local limit = tonumber(ARGV[2])
      local ttl = tonumber(ARGV[3])

      if (used + cost) <= limit then
        local newUsed = redis.call('INCRBY', KEYS[1], cost)
        if ttl > 0 and redis.call('TTL', KEYS[1]) < 0 then
          redis.call('EXPIRE', KEYS[1], ttl)
        end
        return limit - newUsed
      else
        return -1
      end
    `;

    const result = await this.client.eval(luaScript, 1, key, cost.toString(), limit.toString(), ttlSeconds.toString()) as number;

    if (result >= 0) {
      return { allowed: true, remaining: result };
    }
    return { allowed: false, remaining: 0 };
  }
}
