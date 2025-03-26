import { Dto } from '../common/dto';

export class User extends Dto<User> {
  declare public readonly id: string;
  declare public readonly email: string;
  declare public readonly password?: string;
}
