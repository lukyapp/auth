import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserCreatorByOauthStrategy } from '../../../user/services/user-creator/user.creator.by-oauth-strategy';
import { CreateOneUserUseCase } from '../../../user/use-cases/create-one-user.use-case';
import { FindOneUserUseCase } from '../../../user/use-cases/find-one-user.use-case';
import { OauthProfile } from '../../../oauth/beans/oauth-profile.dto';
import { AuthenticatorStrategy } from './authenticator.strategy';

@Injectable()
export class AuthenticatorOauthStrategy extends AuthenticatorStrategy<OauthProfile> {
  private readonly logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly userCreatorByOauth: UserCreatorByOauthStrategy,
    private readonly createOneUserUseCase: CreateOneUserUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
  ) {
    super();
  }

  async authenticate({ email, isEmailVerified }: OauthProfile) {
    if (!isEmailVerified) {
      this.logger.log('! oauthProfile.isEmailVerified');
      throw new BadRequestException(
        'can not authenticate with that provider case your email was not verified',
      );
    }
    if (!email) {
      this.logger.log('! oauthProfile.email');
      throw new BadRequestException('WRONG_CREDENTIALS');
    }
    const found = await this.findOneUserUseCase.perform({ email });
    if (found) {
      return found;
    }
    return await this.createOneUserUseCase.perform(this.userCreatorByOauth, {
      email,
    });
  }
}
