import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GenerateAuthTokenByRefreshTokenBody,
  LogoutBody,
} from '../../application/auth/services/auth-token.service.port';
import { AuthenticatorPasswordStrategy } from '../../application/auth/services/authenticator/authenticator.password-strategy';
import { AuthenticatorRegisterStrategy } from '../../application/auth/services/authenticator/authenticator.register-strategy';
import { AuthenticateByRefreshTokenUseCase } from '../../application/auth/use-cases/authenticate-by-refresh-token.use-case';
import { AuthenticateUseCase } from '../../application/auth/use-cases/authenticate.use-case';
import { LogoutUseCase } from '../../application/auth/use-cases/logout.use-case';
import { ApiBearerAuth } from '../common/decorators/api-bearer-auth.decorator';
import { LoginBody } from './dtos/login.body';
import { CreateUserBody } from '../user/dtos/create-user.body';
import { User } from '../../domain/user/user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Post } from '../common/decorators/http.decorator';
import { AuthenticateUserResponse } from './dtos/authenticate-user.response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticateUseCase: AuthenticateUseCase,
    private readonly authenticateByRefreshTokenUseCase: AuthenticateByRefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly authenticatorRegisterStrategy: AuthenticatorRegisterStrategy,
    private readonly authenticatorPasswordStrategy: AuthenticatorPasswordStrategy,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(@Body() body: CreateUserBody) {
    const data = await this.authenticateUseCase.perform(
      this.authenticatorRegisterStrategy,
      body,
    );
    return new AuthenticateUserResponse(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() body: LoginBody): Promise<AuthenticateUserResponse> {
    const data = await this.authenticateUseCase.perform(
      this.authenticatorPasswordStrategy,
      body,
    );
    return new AuthenticateUserResponse(data);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshTokens(@CurrentUser('refreshToken') refreshToken: string) {
    const data = await this.authenticateByRefreshTokenUseCase.perform(
      new GenerateAuthTokenByRefreshTokenBody({
        refreshToken,
      }),
    );
    return new AuthenticateUserResponse(data);
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @CurrentUser() user: User,
    @Headers('Authorization') authorizationHeader: string,
  ) {
    await this.logoutUseCase.perform(
      new LogoutBody({
        sub: user.id,
        authorizationHeader,
      }),
    );
    return { message: 'Logged out successfully' };
  }
}
