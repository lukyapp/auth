import { Dto } from '../../../domain/common/dto';
import { User } from '../../../domain/user/user.dto';

export class CreateUserBody extends Dto<CreateUserBody> {
  declare public readonly email: string;
  declare public readonly password?: string;
}

export class UpdateUserBody extends Dto<UpdateUserBody> {
  declare public readonly email?: string;
  declare public readonly password?: string;
}

export class GetOneUserBody extends Dto<CreateUserBody> {
  declare public readonly id?: string | string[];
  declare public readonly email?: string | string[];
}

export class GetAllUsersBody extends Dto<GetAllUsersBody> {
  declare public readonly page: number;
  declare public readonly limit: number;
}

export abstract class UserRepositoryPort {
  abstract getUserById(id: string): Promise<User | null>;

  abstract getOneUser(body: GetOneUserBody): Promise<User | null>;

  abstract createUser(body: CreateUserBody): Promise<User>;

  abstract updateUser(id: string, body: UpdateUserBody): Promise<User | null>;

  abstract deleteUser(id: string): Promise<boolean>;

  abstract getAllUsers(body: GetAllUsersBody): Promise<User[]>;

  abstract getUserByEmail(email: string): Promise<User | null>;
}
