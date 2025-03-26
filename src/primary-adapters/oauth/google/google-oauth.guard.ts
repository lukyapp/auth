import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OauthProviderName } from '../../../application/oauth/beans/oauth-provider-name.enum';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard(OauthProviderName.Google) {
  constructor() {
    super();
  }
}
