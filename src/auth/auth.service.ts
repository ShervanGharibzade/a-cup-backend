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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async signIn(userDto: AuthUserDto): Promise<{ token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: userDto.email }, { username: userDto.username }],
    });

    if (existingUser) {
      throw new ConflictException(
        "User with this email or username already exists"
      );
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    const payload = { email: userDto.email, username: userDto.username };
    const accessToken = this.jwtService.sign(payload);

    return { token: accessToken };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { email: user.email, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user ? await bcrypt.compare(password, user.password) : false;
  }
}
