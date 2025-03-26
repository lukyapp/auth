import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwksModule } from './modules/jwks/jwks.module';
import { MyJwtModule } from './modules/jwt/my-jwt.module';
import { GoogleOauthModule } from './modules/oauth/google-oauth.module';
import { UserModule } from './modules/user/user.module';
import { validate } from './infrastructure/config/env.validation';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    MyJwtModule,
    GoogleOauthModule,
    UserModule,
    AuthModule,
    JwksModule,
    DatabaseModule,
    ConfigModule.forRoot({
      validate,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
