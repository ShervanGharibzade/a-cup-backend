import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user/user.entity';

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
		type: 'postgres',
		host: configService.get<string>('DATABASE_HOST', 'localhost'),
		port: configService.get<number>('DATABASE_PORT'),
		username: configService.get<string>('DATABASE_USER', 'root'),
		password: configService.get<string>('DATABASE_PASSWORD', '123123gh'),
		database: configService.get<string>('DATABASE_NAME', 'a-cup-db'),
		entities: [User],
		autoLoadEntities: true,
		synchronize: true,
	}),
};
