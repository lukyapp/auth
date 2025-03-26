import { OauthConfigI } from '../../application/oauth/beans/oauth.config.interface';
import { AuthenticateUserResponseData } from '../../application/auth/dtos/authenticate-user.response';

export abstract class OauthControllerI<TOauthConfig extends OauthConfigI> {
  constructor(protected oauthConfig: TOauthConfig) {}

  abstract authorize(...args: any[]): void | Promise<void>;

  abstract callback(...args: any[]): void | Promise<void>;

  protected buildSuccessUrl({
    userId,
    accessToken,
    refreshToken,
  }: AuthenticateUserResponseData) {
    const url = new URL(this.oauthConfig.successURL);
    url.searchParams.append('userId', userId);
    url.searchParams.append('accessToken', accessToken);
    if (refreshToken) {
      url.searchParams.append('refreshToken', refreshToken);
    }
    return url.toString();
  }
}
