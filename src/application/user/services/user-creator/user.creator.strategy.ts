import { User } from '../../../../domain/user/user.dto';

export abstract class UserCreatorStrategy<TBody> {
  abstract create(body: TBody): Promise<User>;
}
