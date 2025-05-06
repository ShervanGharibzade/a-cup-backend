import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';
import { RedisModule } from './redis/redis.module';
import { AuthController } from './auth/auth.controller';
import { Creator } from './entities/creator/creator.entity';
import { Donation } from './entities/donation/donation.entity';
import { User } from './entities/user/user.entity';
import { Supporter } from './entities/supporter/supporter.entity';
import { Reward } from './entities/reward/reward.entity';
import { Purchase } from './entities/purchase/purchase.entity';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';

dotenv.config();

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost', // App is on host, so use 'localhost'
			port: 5434, // Changed from 5432 to match host mapping
			username: 'root',
			password: '123123gh',
			database: 'a-cup-db',
			entities: [Creator, Donation, User, Supporter, Reward, Purchase],
			autoLoadEntities: true,
			synchronize: true,
		}),
		RedisModule,
		AuthModule,
		UserModule,
	],
	controllers: [AuthController, UserController],
})
export class AppModule {}
