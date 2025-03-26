import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/user/user.dto';
import {
  GetOneUserBody,
  UserRepositoryPort,
} from '../services/user.repository.port';

@Injectable()
export class FindOneUserUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  async perform(body: GetOneUserBody): Promise<User | null> {
    return this.userRepository.getOneUser(body);
  }

  async performById(id: string): Promise<User | null> {
    return this.userRepository.getUserById(id);
  }
}
