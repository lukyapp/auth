import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticatorOauthStrategy } from '../../application/auth/services/authenticator/authenticator.oauth-strategy';
import { AuthenticatorPasswordStrategy } from '../../application/auth/services/authenticator/authenticator.password-strategy';
import { AuthenticatorRegisterStrategy } from '../../application/auth/services/authenticator/authenticator.register-strategy';
import { AuthenticateByRefreshTokenUseCase } from '../../application/auth/use-cases/authenticate-by-refresh-token.use-case';
import { AuthenticateUseCase } from '../../application/auth/use-cases/authenticate.use-case';
import { LogoutUseCase } from '../../application/auth/use-cases/logout.use-case';
import { AuthController } from '../../primary-adapters/auth/auth.controller';
import { JwtAuthStrategy } from '../../primary-adapters/auth/jwt-auth.strategy';
import { UserModule } from '../user/user.module';
import { UtilsModule } from '../utils/utils.module';
import { AuthLocalModule } from './auth.local-module';

@Module({
  controllers: [AuthController],
  imports: [UserModule, AuthLocalModule, UtilsModule, ConfigModule],
  providers: [
    AuthenticatorOauthStrategy,
    AuthenticatorPasswordStrategy,
    AuthenticatorRegisterStrategy,
    AuthenticateUseCase,
    AuthenticateByRefreshTokenUseCase,
    LogoutUseCase,
    JwtAuthStrategy,
  ],
  exports: [
    AuthenticatorOauthStrategy,
    AuthenticatorPasswordStrategy,
    AuthenticatorRegisterStrategy,
    AuthenticateUseCase,
    AuthenticateByRefreshTokenUseCase,
    LogoutUseCase,
    JwtAuthStrategy,
  ],
})
export class AuthModule {}
