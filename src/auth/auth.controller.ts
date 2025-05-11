import {
	Body,
	Controller,
	Headers,
	HttpException,
	HttpStatus,
	InternalServerErrorException,
	Post,
} from '@nestjs/common';
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
	async signUp(@Body() body: AuthUserDto) {
		try {
			const token = await this.authService.register(body);
			return {
				token,
			};
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Post('/logout')
	async logOut(@Headers('authorization') authHeader: string) {
		const token = authHeader?.split(' ')[1];
		return await this.authService.logout(token);
	}
}
