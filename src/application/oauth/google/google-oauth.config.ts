import { OauthProviderName } from '../beans/oauth-provider-name.enum';
import {
  OauthConfigI,
  RequiredOauthConfig,
} from '../beans/oauth.config.interface';

export class GoogleOauthConfig extends OauthConfigI<OauthProviderName.Google> {
  constructor(oauthConfig: RequiredOauthConfig) {
    super({
      oauthName: OauthProviderName.Google,

      domain: 'accounts.google.com',
      issuer: 'https://accounts.google.com',

      jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
      authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenURL: 'https://oauth2.googleapis.com/token',
      userInfoURL: 'https://openidconnect.googleapis.com/v1/userinfo',

      // scope: ['openid', 'profile', 'email'],
      scope: ['email'],
      ...oauthConfig,
    });
  }
}
