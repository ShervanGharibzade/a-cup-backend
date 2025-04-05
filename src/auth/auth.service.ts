import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { User } from "src/entities/user/user.entity";
import { AuthUserDto } from "./authDto/authUser.dto";
import * as jwt from "jsonwebtoken";
import { redisClient } from "src/core/redis/redis.provider";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(userDto: AuthUserDto): Promise<{ token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: userDto.email }, { username: userDto.username }],
    });

    if (existingUser) {
      throw new ConflictException(
        "User with this email or username already exists",
      );
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

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { email: user.email, username: user.username };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async logout(token: string): Promise<{ message: string }> {
    try {
      const decoded: any = jwt.decode(token);
      if (!decoded || !decoded.exp) {
        throw new UnauthorizedException("Invalid token");
      }

      const ttl = 2 * 24 * 60 * 60; // 2 days

      await redisClient.set(`blacklist:${token}`, "true", "EX", ttl);

      return { message: "User logged out successfully" };
    } catch (err) {
      throw new UnauthorizedException("Logout failed");
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await redisClient.get(`blacklist:${token}`);
    return result === "true";
  }
}
