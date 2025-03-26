import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/user/user.dto';
import {
  GetAllUsersBody,
  UserRepositoryPort,
} from '../services/user.repository.port';

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async perform(body: GetAllUsersBody): Promise<User[]> {
    return this.userRepository.getAllUsers(body);
  }
}
