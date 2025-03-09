import { User } from '../../user/user.entity';
import { AuthTokens } from '../auth.types';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

export abstract class AuthServicePort {
  abstract register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; tokens: AuthTokens }>;

  abstract login(
    loginDto: LoginDto,
  ): Promise<{ user: User; tokens: AuthTokens }>;

  abstract refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthTokens>;

  abstract logout(userId: string): Promise<void>;
}
