import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

dotenv.config();

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'root',
			password: '123123gh',
			database: 'a-cup-db',
			autoLoadEntities: true,
			synchronize: true,
		}),
		RedisModule,
		AuthModule,
	],
})
export class AppModule {}
