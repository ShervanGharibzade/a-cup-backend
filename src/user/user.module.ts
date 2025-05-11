// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from 'src/entities/user/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
			secret: 'shsshshsh',
			signOptions: { expiresIn: '48h' },
		}),
	],
	providers: [UserService],
	exports: [UserService, JwtModule],
})
export class UserModule {}
