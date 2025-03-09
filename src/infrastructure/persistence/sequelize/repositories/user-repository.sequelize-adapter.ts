import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateUserDto } from '../../../../domain/user/dto/update-user.dto';
import { UserRepositoryPort } from '../../../../domain/user/ports/user.repository.port';
import { User } from '../../../../domain/user/user.entity';
import { UserModel } from '../models/user.model';

@Injectable()
export class UserRepositorySequelizeAdapter implements UserRepositoryPort {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
  ) {}

  async save(user: User): Promise<User> {
    const [userModel] = await this.userModel.upsert({
      id: user.id,
      email: user.email,
      refreshToken: user.getRefreshToken(),
    });

    return this.toDomain(userModel);
  }

  async findById(id: string): Promise<User | null> {
    const userModel = await this.userModel.findByPk(id);
    return userModel ? this.toDomain(userModel) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userModel = await this.userModel.findOne({
      where: { email },
    });
    return userModel ? this.toDomain(userModel) : null;
  }

  async update(userId: string, hashedToken: UpdateUserDto): Promise<void> {
    await this.userModel.update(
      { refreshToken: hashedToken },
      { where: { id: userId } },
    );
  }

  async updateRefreshToken(
    userId: string,
    hashedToken: string | null,
  ): Promise<void> {
    await this.userModel.update(
      { refreshToken: hashedToken },
      { where: { id: userId } },
    );
  }

  private toDomain(model: UserModel): User {
    return new User(
      model.id,
      model.email,
      model.hashedPassword,
      model.refreshToken,
    );
  }
}
