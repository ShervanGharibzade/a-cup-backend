import {
	Injectable,
	ConflictException,
	UnauthorizedException,
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthUserDto } from './authDto/authUser.dto';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from 'src/user/user.service';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly redisService: RedisService,
		private readonly jwtService: JwtService,
	) {}

	async register(userDto: AuthUserDto): Promise<string> {
		try {
			const isExisted = await this.userService.isUsed(userDto.email, userDto.username);

			if (isExisted) {
				throw new ConflictException(`User with this username or email already exists`);
			}

			const hashedPassword = await bcrypt.hash(userDto.password, 10);

			const { username, email } = userDto;
			const newUser = this.userService.create({
				username,
				email,
				password_hash: hashedPassword,
			});

			await this.userService.save(newUser);

			const payload = { email: userDto.email, username: userDto.username };
			const accessToken = this.jwtService.sign(payload);

			return accessToken;
		} catch (error) {
			console.error('Error in register method:', error);

			if (error instanceof QueryFailedError && (error as any).code === '23505') {
				throw { status: 40120, message: 'User with this email or username already exists' };
			}

			if (error instanceof ConflictException) {
				throw error;
			}

			throw new InternalServerErrorException(error);
		}
	}

	async blacklistToken(token: string): Promise<void> {
		const decoded = this.jwtService.decode(token) as { exp: number };
		if (!decoded || !decoded.exp) {
			throw new Error('Invalid token');
		}

		const currentTime = Math.floor(Date.now() / 1000);
		const expiry = decoded.exp - currentTime;

		if (expiry > 0) {
			await this.redisService.addToBlacklist(token);
		}
	}
	async login(email: string, password: string): Promise<{ accessToken: string }> {
		const user = await this.userService.findByEmail(email);

		if (!user || !(await bcrypt.compare(password, user.password_hash))) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { email: user.email, username: user.username };
		const accessToken = this.jwtService.sign(payload);

		return { accessToken };
	}

	async logout(token: string): Promise<{ message: string }> {
		if (!token || typeof token !== 'string' || token.trim() === '') {
			throw new BadRequestException('Invalid or missing token');
		}

		try {
			await this.blacklistToken(token);
			return { message: 'User logged out successfully' };
		} catch (error) {
			console.error('Logout error:', error.message);

			if (error.message.includes('Invalid token')) {
				throw new BadRequestException('Invalid token');
			}
			throw new UnauthorizedException('Failed to logout due to server error');
		}
	}
}
