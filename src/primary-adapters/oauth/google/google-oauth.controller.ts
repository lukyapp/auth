import { Controller, Headers, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthenticatorOauthStrategy } from '../../../application/auth/services/authenticator/authenticator.oauth-strategy';
import { AuthenticateUseCase } from '../../../application/auth/use-cases/authenticate.use-case';
import { OauthValidateResult } from '../../../application/oauth/beans/oauth-validate-result.dto';
import { GoogleOauthConfig } from '../../../application/oauth/google/google-oauth.config';
import { AuthenticateUserResponse } from '../../auth/dtos/authenticate-user.response';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Get } from '../../common/decorators/http.decorator';
import { OauthControllerI } from '../oauth.controller.interface';
import { GoogleOAuthGuard } from './google-oauth.guard';

@ApiTags('auth Google')
@Controller('auth/google')
export class GoogleOauthController extends OauthControllerI<GoogleOauthConfig> {
  constructor(
    oauthConfig: GoogleOauthConfig,
    private readonly authenticateUseCase: AuthenticateUseCase,
    private readonly authenticatorOauthStrategy: AuthenticatorOauthStrategy,
  ) {
    super(oauthConfig);
  }

  @Get('authorize')
  @UseGuards(GoogleOAuthGuard)
  authorize(): void | Promise<void> {}

  @Get('callback')
  @UseGuards(GoogleOAuthGuard)
  async callback(
    @CurrentUser() { profile }: OauthValidateResult,
    @Res() response: Response,
    @Headers('user-agent') userAgent: string,
  ): Promise<void> {
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent);
    const authenticateUserResponseData = await this.authenticateUseCase.perform(
      this.authenticatorOauthStrategy,
      profile,
    );

    if (!isMobile) {
      response.redirect(this.buildSuccessUrl(authenticateUserResponseData));
      return;
    }

    const { userId, accessToken, refreshToken } = authenticateUserResponseData;
    const url = new URL('besafe://auth-callback');
    url.searchParams.append('userId', userId);
    url.searchParams.append('accessToken', accessToken);
    if (refreshToken) {
      url.searchParams.append('refreshToken', refreshToken);
    }
    response.redirect(url.toString());
  }

  @Get('success')
  success(
    @Query('userId') userId: string,
    @Query('accessToken') accessToken: string,
    @Query('refreshToken') refreshToken: string,
  ): AuthenticateUserResponse {
    return new AuthenticateUserResponse({
      userId,
      accessToken,
      refreshToken,
    });
  }
}
