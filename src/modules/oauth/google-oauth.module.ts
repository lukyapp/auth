import { Module } from '@nestjs/common';
import { ConfigurationServicePort } from '../../application/config/service/configuration.service.port';
import { GoogleOauthConfig } from '../../application/oauth/google/google-oauth.config';
import { GoogleOauthController } from '../../primary-adapters/oauth/google/google-oauth.controller';
import { GoogleOAuthGuard } from '../../primary-adapters/oauth/google/google-oauth.guard';
import { GoogleOauthStrategy } from '../../primary-adapters/oauth/google/google-oauth.strategy';
import { Utils } from '../../utils/utils';
import { AuthModule } from '../auth/auth.module';
import { ConfigurationModule } from '../config/configuration.module';

@Module({
  controllers: [GoogleOauthController],
  imports: [AuthModule, ConfigurationModule],
  providers: [
    GoogleOauthStrategy,
    GoogleOAuthGuard,
    {
      provide: GoogleOauthConfig,
      inject: [ConfigurationServicePort],
      useFactory: (configurationService: ConfigurationServicePort) => {
        const baseUrl = configurationService.get('BASE_URL');
        return new GoogleOauthConfig({
          clientID: configurationService.get('OAUTH_GOOGLE_CLIENT_ID'),
          clientSecret: configurationService.get('OAUTH_GOOGLE_CLIENT_SECRET'),
          callbackURL: Utils.urlJoin(baseUrl, '/auth/google/callback'),
          successURL: Utils.urlJoin(baseUrl, '/auth/google/success'),
        });
      },
    },
  ],
})
export class GoogleOauthModule {}
