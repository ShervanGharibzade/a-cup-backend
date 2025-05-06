// user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user/user.entity';

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
		const user = await this.userRepository.findOne({
			where: [{ email }, { username }],
		});
		return !!user;
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
