import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Dto } from '../../../../domain/common/dto';
import { UserRepositoryPort } from '../../../user/services/user.repository.port';
import { PasswordHasherPort } from '../../../utils/password-hasher.port';
import { AuthenticatorStrategy } from './authenticator.strategy';

export class AuthenticatorPasswordStrategyBody extends Dto<AuthenticatorPasswordStrategyBody> {
  declare public readonly email: string;
  declare public readonly password: string;
}

@Injectable()
export class AuthenticatorPasswordStrategy extends AuthenticatorStrategy<AuthenticatorPasswordStrategyBody> {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {
    super();
  }

  async authenticate({ email, password }: AuthenticatorPasswordStrategyBody) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('wrong password');
    }
    // TODO check user.isEmailVerified
    this.logger.warn('TODO check user.isEmailVerified');
    const isCorrectPassword = await this.passwordHasher.compare(
      password,
      user.password,
    );
    if (!isCorrectPassword) {
      throw new BadRequestException('wrong password');
    }
    return user;
  }
}
