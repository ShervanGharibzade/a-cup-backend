// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user/user.entity';
import { log } from 'console';
import { userInfo } from 'os';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async findByEmail(email: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { email } });
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	}

	async isUsed(email: string, username: string): Promise<boolean> {
		const [emailUser, usernameUser] = await Promise.all([
			this.userRepository.findOne({ where: { email } }),
			this.userRepository.findOne({ where: { username } }),
		]);
		console.log(emailUser, usernameUser, 'ge');

		return !!emailUser || !!usernameUser;
	}

	create(userData: Partial<User>): User {
		return this.userRepository.create(userData);
	}

	async save(user: User): Promise<User> {
		return await this.userRepository.save(user);
	}

	async findById(id: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { id } });
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	}
}
