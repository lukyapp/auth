import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ClassSerializerInterceptorOptions } from '@nestjs/common/serializer/class-serializer.interceptor';
import { Reflector } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { JwksModule } from './modules/jwks/jwks.module';
import { MyJwtModule } from './modules/jwt/my-jwt.module';
import { GoogleOauthModule } from './modules/oauth/google-oauth.module';
import { UserModule } from './modules/user/user.module';
import { ValidationModule } from './modules/utils/validation.module';

@Module({
  imports: [
    ValidationModule,
    MyJwtModule,
    GoogleOauthModule,
    UserModule,
    AuthModule,
    JwksModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: ClassSerializerInterceptor,
      inject: [Reflector, 'ClassSerializerInterceptorOptions'],
      useFactory: (
        reflector: Reflector,
        options: ClassSerializerInterceptorOptions,
      ) => {
        return new ClassSerializerInterceptor(reflector, options);
      },
    },
    {
      provide: ValidationPipe,
      inject: ['ValidationPipeOptions'],
      useFactory: (options: ValidationPipeOptions) => {
        return new ValidationPipe(options);
      },
    },
  ],
})
export class AppModule {}
