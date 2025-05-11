import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { RedisModule } from './redis/redis.module';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		TypeOrmModule.forRootAsync(typeOrmConfig),
		RedisModule,
		AuthModule,
		UserModule,
	],
	controllers: [AuthController, UserController],
})
export class AppModule {}
