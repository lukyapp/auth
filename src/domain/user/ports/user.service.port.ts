import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../user.entity';

export abstract class UserServicePort {
  abstract findAll(): Promise<User[]>;

  abstract findOne(id: string): Promise<User>;

  abstract update(id: string, updateUserDto: UpdateUserDto): Promise<User>;

  abstract remove(id: string): Promise<void>;
}
