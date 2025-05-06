// user.controller.ts
import { Controller, Post, Body, Get, Headers, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('register')
	async register(@Body() createUserDto: any) {
		const user = await this.userService.create(createUserDto);
		return { message: 'User registered successfully', user };
	}

	@Get('profile')
	async getProfile(@Req() req: Request) {
		const userId = 22;
		const user = await this.userService.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}
		return { message: 'Profile retrieved successfully', user };
	}
}
