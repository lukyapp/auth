import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Error } from 'sequelize';
import { OauthProfile } from '../../../application/oauth/beans/oauth-profile.dto';
import { OauthProviderName } from '../../../application/oauth/beans/oauth-provider-name.enum';
import { OauthValidateResult } from '../../../application/oauth/beans/oauth-validate-result.dto';
import { GoogleOauthConfig } from '../../../application/oauth/google/google-oauth.config';
import { OauthStrategyI } from '../../../application/oauth/oauth.strategy.interface';

@Injectable()
export class GoogleOauthStrategy
  extends PassportStrategy(Strategy, OauthProviderName.Google)
  implements OauthStrategyI<Profile>
{
  constructor(oauthConfig: GoogleOauthConfig) {
    super({
      authorizationURL: oauthConfig.authorizationURL,
      tokenURL: oauthConfig.tokenURL,
      userProfileURL: oauthConfig.userInfoURL,
      clientID: oauthConfig.clientID,
      clientSecret: oauthConfig.clientSecret,
      callbackURL: oauthConfig.callbackURL,
      scope: oauthConfig.scope,
      state: true,
    });
  }

  validate(
    accessToken: string,
    refreshToken: string | undefined,
    profile: Profile | undefined,
    done: (
      err: Error | undefined | null,
      user: OauthValidateResult | undefined,
      info?: object,
    ) => void,
  ): void {
    done(
      null,
      new OauthValidateResult({
        accessToken,
        refreshToken,
        profile: new OauthProfile({
          id: profile?._json.sub,
          email: profile?._json.email,
          isEmailVerified: profile?._json.email_verified,
          name: profile?._json.name,
        }),
      }),
    );
  }
}
