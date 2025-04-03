import {
  Controller,
  Logger,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthenticateUserResponseData } from '../../application/auth/dtos/authenticate-user.response';
import { AuthenticatorOauthStrategy } from '../../application/auth/services/authenticator/authenticator.oauth-strategy';
import { AuthenticateUseCase } from '../../application/auth/use-cases/authenticate.use-case';
import { ConfigurationServicePort } from '../../application/config/service/configuration.service.port';
import { OauthValidateResult } from '../../application/oauth/beans/oauth-validate-result.dto';
import { Utils } from '../../utils/utils';
import { AuthenticateUserResponse } from '../auth/dtos/authenticate-user.response';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Get } from '../common/decorators/http.decorator';
import { OauthEndpointParam } from './dto/oauth-endpoint.param';
import { OauthControllerI } from './oauth.controller.interface';
import { OauthGuard } from './oauth.guard';

@ApiTags('oauth')
@Controller('auth/:oauthProviderName')
export class OauthController implements OauthControllerI {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly authenticateUseCase: AuthenticateUseCase,
    private readonly authenticatorOauthStrategy: AuthenticatorOauthStrategy,
    private readonly configurationService: ConfigurationServicePort,
  ) {}

  @Get('authorize')
  @UseGuards(OauthGuard)
  authorize(
    @Param() { oauthProviderName }: OauthEndpointParam,
  ): void | Promise<void> {
    this.logger.log(`oauth authorize with ${oauthProviderName} provider`);
  }

  @Get('callback')
  @UseGuards(OauthGuard)
  async callback(
    @CurrentUser() { profile }: OauthValidateResult,
    @Req() request: Request,
    @Res() response: Response,
    @Param() { oauthProviderName }: OauthEndpointParam,
  ): Promise<void> {
    const userAgent = request.headers['user-agent'];
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(userAgent ?? '');
    this.logger.log(
      `oauth callback with ${oauthProviderName} provider and ${isMobile ? 'mobile' : 'web'} agent`,
    );

    const successCallback =
      // @ts-expect-error request.session
      request.session['successCallback'] as string | undefined;

    const baseUrl = this.configurationService.get('BASE_URL');
    const successWebCallback = Utils.urlJoin(
      baseUrl,
      `/auth/${oauthProviderName}/success`,
    );
    const successUrl = new URL(successCallback ?? successWebCallback);

    const authenticateUserResponseData = await this.authenticateUseCase.perform(
      this.authenticatorOauthStrategy,
      profile,
    );
    response.redirect(
      this.buildSuccessUrl(successUrl, authenticateUserResponseData),
    );
  }

  @Get('success')
  success(
    @Param() { oauthProviderName }: OauthEndpointParam,
    @Query('userId') userId: string,
    @Query('accessToken') accessToken: string,
    @Query('refreshToken') refreshToken: string,
  ): AuthenticateUserResponse {
    this.logger.log(`oauth success with ${oauthProviderName} provider`);
    return new AuthenticateUserResponse({
      userId,
      accessToken,
      refreshToken,
    });
  }

  protected buildSuccessUrl(
    baseUrl: URL,
    { userId, accessToken, refreshToken }: AuthenticateUserResponseData,
  ) {
    baseUrl.searchParams.append('userId', userId);
    baseUrl.searchParams.append('accessToken', accessToken);
    if (refreshToken) {
      baseUrl.searchParams.append('refreshToken', refreshToken);
    }
    return baseUrl.toString();
  }
}
