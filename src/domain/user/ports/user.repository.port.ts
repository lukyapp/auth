import { User } from '../user.entity';

export abstract class UserRepositoryPort {
  abstract save(user: User): Promise<User>;

  abstract findById(id: string): Promise<User | null>;

  abstract findByEmail(email: string): Promise<User | null>;

  abstract updateRefreshToken(
    userId: string,
    hashedToken: string | null,
  ): Promise<void>;
}
