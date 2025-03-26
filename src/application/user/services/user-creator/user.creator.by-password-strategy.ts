import { Injectable } from '@nestjs/common';
import { Dto } from '../../../../domain/common/dto';
import { User } from '../../../../domain/user/user.dto';
import { PasswordHasherPort } from '../../../utils/password-hasher.port';
import { UserCreatorStrategy } from './user.creator.strategy';
import { UserRepositoryPort } from '../user.repository.port';

export class UserCreatorByPasswordStrategyBody extends Dto<UserCreatorByPasswordStrategyBody> {
  declare public readonly email: string;
  declare public readonly password: string;
}

@Injectable()
export class UserCreatorByPasswordStrategy
  implements UserCreatorStrategy<UserCreatorByPasswordStrategyBody>
{
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async create({
    password: notHasedPassword,
    ...body
  }: UserCreatorByPasswordStrategyBody): Promise<User> {
    const { email } = body;
    const found = await this.userRepository.getUserByEmail(email);
    if (found) {
      return found;
    }
    const password = await this.passwordHasher.hash(notHasedPassword);
    return this.userRepository.createUser({
      password,
      ...body,
    });
  }
}
