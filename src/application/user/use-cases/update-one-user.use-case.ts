import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/user/user.dto';
import {
  UpdateUserBody,
  UserRepositoryPort,
} from '../services/user.repository.port';

@Injectable()
export class UpdateOneUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async perform(id: string, body: UpdateUserBody): Promise<User | null> {
    const isBodyEmpty = Object.entries(body).length === 0;
    if (isBodyEmpty) {
      return this.userRepository.getUserById(id);
    }
    return this.userRepository.updateUser(id, body);
  }
}
