import { Controller, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
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
  authorize(@Req() req: Request): void | Promise<void> {
    console.log(req.url);
  }

  @Get('callback')
  @UseGuards(GoogleOAuthGuard)
  async callback(
    @CurrentUser() { profile }: OauthValidateResult,
    @Res() response: Response,
  ): Promise<void> {
    const authenticateUserResponseData = await this.authenticateUseCase.perform(
      this.authenticatorOauthStrategy,
      profile,
    );
    response.redirect(this.buildSuccessUrl(authenticateUserResponseData));
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
