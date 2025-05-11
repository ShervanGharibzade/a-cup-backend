// user.controller.ts
import { Controller, Post, Body, Get, Headers, UseGuards, Req, Header, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	@Post('register')
	async register(@Body() createUserDto: any) {
		const user = await this.userService.create(createUserDto);
		return { message: 'User registered successfully', user };
	}

	@Get('profile')
	async getProfile(@Headers('authorization') authHeader: string) {
		if (!authHeader) {
			throw new UnauthorizedException('Authorization header missing');
		}

		const token = authHeader.split(' ')[1];
		if (!token) {
			throw new UnauthorizedException('Token not found in Authorization header');
		}

		let payload: any;
		try {
			const secret = this.configService.get<string>('JWT_SECRET');
			payload = this.jwtService.verify(token, { secret });
		} catch (err) {
			throw new UnauthorizedException('Invalid token');
		}

		const userId = payload.userId;
		const user = await this.userService.findById(userId);

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		return { user };
	}
}
