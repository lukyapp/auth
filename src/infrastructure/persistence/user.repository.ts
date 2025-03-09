import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/user/ports/user.repository.port';
import { User } from '../../domain/user/user.entity';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return (
      Array.from(this.users.values()).find((user) => user.email === email) ||
      null
    );
  }

  async updateRefreshToken(
    userId: string,
    hashedToken: string | null,
  ): Promise<void> {
    const user = await this.findById(userId);
    if (user) {
      hashedToken
        ? user.setRefreshToken(hashedToken)
        : user.removeRefreshToken();
      await this.save(user);
    }
  }
}
