import { User } from '../../../../domain/user/user.dto';

export abstract class AuthenticatorStrategy<TBody> {
  abstract authenticate(body: TBody): Promise<User>;
}
