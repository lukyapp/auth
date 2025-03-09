import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EnvironmentVariables } from '../../config/env.validation';
import { AuthTokens } from '../../domain/auth/auth.types';
import { LoginDto } from '../../domain/auth/dto/login.dto';
import { RegisterDto } from '../../domain/auth/dto/register.dto';
import { AuthServicePort } from '../../domain/auth/ports/auth.service.port';
import { PasswordHasherPort } from '../../domain/auth/ports/password-hasher.port';
import { UserRepositoryPort } from '../../domain/user/ports/user.repository.port';
import { User } from '../../domain/user/user.entity';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const existingUser = await this.userRepository.findByEmail(
      registerDto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.passwordHasher.hash(registerDto.password);
    const user = User.create(
      registerDto.email,
      registerDto.firstName,
      registerDto.lastName,
      hashedPassword,
    );

    await this.userRepository.save(user);
    const tokens = await this.generateTokens(user.id);
    await this.userRepository.updateRefreshToken(
      user.id,
      await this.passwordHasher.hash(tokens.refreshToken),
    );

    return { user, tokens };
  }

  async login(loginDto: LoginDto): Promise<{ user: User; tokens: AuthTokens }> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      loginDto.password,
      user.getPassword(),
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id);
    await this.userRepository.updateRefreshToken(
      user.id,
      await this.passwordHasher.hash(tokens.refreshToken),
    );

    return { user, tokens };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const user = await this.userRepository.findById(userId);
    if (!user || !user.getRefreshToken()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userRefreshToken = user.getRefreshToken();
    if (!userRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const refreshTokenMatches = await this.passwordHasher.compare(
      refreshToken,
      userRefreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user.id);
    await this.userRepository.updateRefreshToken(
      user.id,
      await this.passwordHasher.hash(tokens.refreshToken),
    );

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  private async generateTokens(userId: string): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
