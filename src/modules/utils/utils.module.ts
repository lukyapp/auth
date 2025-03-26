import { Module } from '@nestjs/common';
import { PasswordHasherPort } from '../../application/utils/password-hasher.port';
import { PasswordHasherBcryptAdapter } from '../../infrastructure/utils/password-hasher/password-hasher.bcrypt-adapter';

@Module({
  providers: [
    {
      provide: PasswordHasherPort,
      useClass: PasswordHasherBcryptAdapter,
    },
  ],
  exports: [PasswordHasherPort],
})
export class UtilsModule {}
