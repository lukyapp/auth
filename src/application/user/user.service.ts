import { Injectable, NotFoundException } from '@nestjs/common';
import { PasswordHasherPort } from '../../domain/auth/ports/password-hasher.port';
import { UpdateUserDto } from '../../domain/user/dto/update-user.dto';
import { UserRepositoryPort } from '../../domain/user/ports/user.repository.port';
import { UserServicePort } from '../../domain/user/ports/user.service.port';
import { User } from '../../domain/user/user.entity';

@Injectable()
export class UserService implements UserServicePort {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async findAll(): Promise<User[]> {
    // Implementation would depend on additional repository methods
    throw new Error('Method not implemented.');
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(
    id: string,
    { password, ...updateUserDto }: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOne(id);

    let hashedPassword;
    if (password) {
      hashedPassword = await this.passwordHasher.hash(password);
    }

    const updatedUser = new User(
      user.id,
      updateUserDto.email ?? user.email,
      hashedPassword,
      user.getRefreshToken(),
    );
    return this.userRepository.save(updatedUser);
  }

  async remove(id: string): Promise<void> {
    // Implementation would depend on additional repository methods
    throw new Error('Method not implemented.');
  }
}
