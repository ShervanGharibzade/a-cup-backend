import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly redisService: RedisService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = request.headers['authorization']?.split(' ')[1];

		if (!token) {
			return false;
		}

		const isBlacklisted = await this.redisService.isBlacklisted(token);
		if (isBlacklisted) {
			return false;
		}

		return true;
	}
}
