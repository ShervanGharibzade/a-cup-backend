import { Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthUserDto } from './authDto/authUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/sign-in')
	async signIn(data: AuthUserDto) {
		return await this.authService.login(data.email, data.password);
	}

	@Post('/sign-up')
	async signUp(data: AuthUserDto) {
		return await this.authService.signIn(data);
	}

	@Post('/logout')
	async logOut(@Headers('authorization') authHeader: string) {
		const token = authHeader?.split(' ')[1];
		return await this.authService.logout(token);
	}
}
