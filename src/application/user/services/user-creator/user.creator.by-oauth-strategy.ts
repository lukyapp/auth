import { Injectable, Logger } from '@nestjs/common';
import { User } from '../../../../domain/user/user.dto';
import { OauthProfile } from '../../../oauth/beans/oauth-profile.dto';
import { UserCreatorStrategy } from './user.creator.strategy';
import { UserRepositoryPort } from '../user.repository.port';

@Injectable()
export class UserCreatorByOauthStrategy
  implements UserCreatorStrategy<OauthProfile>
{
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(private readonly userRepository: UserRepositoryPort) {}

  create({ email }: { email: string }): Promise<User> {
    return this.userRepository.createUser({
      email,
    });
  }
}
