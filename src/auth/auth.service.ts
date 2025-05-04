import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user/user.entity';
import { AuthUserDto } from './authDto/authUser.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly redisService: RedisService,
		private readonly jwtService: JwtService,
	) {}

	async signIn(userDto: AuthUserDto): Promise<{ token: string }> {
		const existingUser = await this.userRepository.findOne({
			where: [{ email: userDto.email }, { username: userDto.username }],
		});

		if (existingUser) {
			throw new ConflictException('User with this email or username already exists');
		}

		const hashedPassword = await bcrypt.hash(userDto.password, 10);

		const newUser = this.userRepository.create({
			...userDto,
			password_hash: hashedPassword,
		});

		await this.userRepository.save(newUser);

		const payload = { email: userDto.email, username: userDto.username };
		const accessToken = this.jwtService.sign(payload);

		return { token: accessToken };
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
		const user = await this.userRepository.findOne({ where: { email } });

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
