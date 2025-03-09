import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvironmentVariables, validate } from '../../config/env.validation';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { PasswordHasherPort } from '../../domain/auth/ports/password-hasher.port';
import { UserRepositoryPort } from '../../domain/user/ports/user.repository.port';
import { BcryptPasswordHasherAdapter } from '../../infrastructure/crypto/bcrypt-password-hasher.adapter';
import { UserRepository } from '../../infrastructure/persistence/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    {
      provide: UserRepositoryPort,
      useClass: UserRepository,
    },
    {
      provide: PasswordHasherPort,
      useClass: BcryptPasswordHasherAdapter,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
