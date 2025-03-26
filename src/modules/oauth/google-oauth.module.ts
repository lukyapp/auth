import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleOauthConfig } from '../../application/oauth/google/google-oauth.config';
import { EnvironmentVariables } from '../../infrastructure/config/environment-variables';
import { GoogleOauthController } from '../../primary-adapters/oauth/google/google-oauth.controller';
import { GoogleOAuthGuard } from '../../primary-adapters/oauth/google/google-oauth.guard';
import { GoogleOauthStrategy } from '../../primary-adapters/oauth/google/google-oauth.strategy';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [GoogleOauthController],
  imports: [AuthModule, ConfigModule],
  providers: [
    GoogleOauthStrategy,
    GoogleOAuthGuard,
    {
      provide: GoogleOauthConfig,
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => {
        return new GoogleOauthConfig({
          clientID: configService.get('OAUTH_GOOGLE_CLIENT_ID'),
          clientSecret: configService.get('OAUTH_GOOGLE_CLIENT_SECRET'),
          callbackURL: 'http://localhost:3000/auth/google/callback',
          successURL: 'http://localhost:3000/auth/google/success',
        });
      },
    },
  ],
})
export class GoogleOauthModule {}
