import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private usersRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { name, phoneNumber, password } = registerDto;

    // Check if phone already exists
    const existingUser = await this.usersRepository.findOneBy({ phoneNumber });
    if (existingUser) {
      throw new UnauthorizedException('Phone number already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      name,
      phoneNumber,
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto) {
    const { phoneNumber, password } = loginDto;

    const user = await this.usersRepository.findOneBy({ phoneNumber });
    if (!user) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    // Generate JWT
    const payload = { sub: user.id, phoneNumber: user.phoneNumber, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    };
  }

  // Optional: validate user for JWT strategy
  async validateUser(id: number): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}