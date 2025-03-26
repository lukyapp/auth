import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { PasswordHasherPort } from '../../../application/utils/password-hasher.port';

@Injectable()
export class PasswordHasherBcryptAdapter implements PasswordHasherPort {
  private readonly SALT_ROUNDS = 10;

  async hash(password: string): Promise<string> {
    return hash(password, this.SALT_ROUNDS);
  }

  async compare(password: string, hashedPassword?: string): Promise<boolean> {
    if (!hashedPassword) {
      return false;
    }
    return compare(password, hashedPassword);
  }
}
