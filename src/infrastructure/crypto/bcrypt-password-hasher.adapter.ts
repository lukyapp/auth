import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { PasswordHasherPort } from '../../domain/auth/ports/password-hasher.port';

@Injectable()
export class BcryptPasswordHasherAdapter implements PasswordHasherPort {
  private readonly SALT_ROUNDS = 10;

  async hash(password: string): Promise<string> {
    return hash(password, this.SALT_ROUNDS);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
