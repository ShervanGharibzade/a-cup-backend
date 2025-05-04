import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
	constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

	async addToBlacklist(token: string): Promise<void> {
		await this.redisClient.set(`blacklist:${token}`, 'true', 'EX', 172800);
	}

	async isBlacklisted(token: string): Promise<boolean> {
		const result = await this.redisClient.get(`blacklist:${token}`);
		return !!result;
	}
}
