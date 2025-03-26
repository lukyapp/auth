import { Injectable, Logger } from '@nestjs/common';
import { Dto } from '../../../../domain/common/dto';
import { UserCreatorByPasswordStrategy } from '../../../user/services/user-creator/user.creator.by-password-strategy';
import { UserRepositoryPort } from '../../../user/services/user.repository.port';
import { CreateOneUserUseCase } from '../../../user/use-cases/create-one-user.use-case';
import { AuthenticateUseCase } from '../../use-cases/authenticate.use-case';
import { AuthenticatorPasswordStrategy } from './authenticator.password-strategy';
import { AuthenticatorStrategy } from './authenticator.strategy';

export class AuthenticatorRegisterStrategyBody extends Dto<AuthenticatorRegisterStrategyBody> {
  declare public readonly email: string;
  declare public readonly password: string;
}

@Injectable()
export class AuthenticatorRegisterStrategy extends AuthenticatorStrategy<AuthenticatorRegisterStrategyBody> {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly authenticateUseCase: AuthenticateUseCase,
    private readonly authenticatorPasswordStrategy: AuthenticatorPasswordStrategy,
    private readonly userRepository: UserRepositoryPort,
    private readonly createOneUserUseCase: CreateOneUserUseCase,
    private readonly userCreatorByPasswordStrategy: UserCreatorByPasswordStrategy,
  ) {
    super();
  }

  async authenticate(body: AuthenticatorRegisterStrategyBody) {
    const { email } = body;
    const found = await this.userRepository.getUserByEmail(email);
    if (found) {
      return await this.authenticatorPasswordStrategy.authenticate(body);
    }
    const user = await this.createOneUserUseCase.perform(
      this.userCreatorByPasswordStrategy,
      body,
    );
    this.logger.log('user created');
    return user;
  }
}
