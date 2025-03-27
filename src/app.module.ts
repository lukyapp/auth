import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { JwksModule } from './modules/jwks/jwks.module';
import { MyJwtModule } from './modules/jwt/my-jwt.module';
import { GoogleOauthModule } from './modules/oauth/google-oauth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    MyJwtModule,
    GoogleOauthModule,
    UserModule,
    AuthModule,
    JwksModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
