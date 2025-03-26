import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateUserBody,
  GetAllUsersBody,
  GetOneUserBody,
  UpdateUserBody,
  UserRepositoryPort,
} from '../../../application/user/services/user.repository.port';
import { User } from '../../../domain/user/user.dto';
import { UserSequelizeModel } from './user.sequlize-model';

@Injectable()
export class UserRepositorySequelizeAdapter implements UserRepositoryPort {
  constructor(
    @InjectModel(UserSequelizeModel)
    private readonly model: typeof UserSequelizeModel,
  ) {}

  async getOneUser(body: GetOneUserBody): Promise<User | null> {
    const user = await this.model.findOne({
      // @ts-expect-error where
      where: body,
    });
    return this.mapToDomain(user);
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.model.findByPk(id);
    return this.mapToDomain(user);
  }

  async createUser(body: CreateUserBody): Promise<User> {
    const user = await this.model.create(body);
    return this.mapToDomain(user);
  }

  async updateUser(id: string, body: UpdateUserBody): Promise<User | null> {
    const [updatedRows, [user]] = await this.model.update(body, {
      where: { id },
      returning: true,
    });
    return updatedRows > 0 ? this.mapToDomain(user) : null;
  }

  async deleteUser(id: string): Promise<boolean> {
    const deletedRows = await this.model.destroy({ where: { id } });
    return deletedRows > 0;
  }

  async getAllUsers({ page, limit }: GetAllUsersBody): Promise<User[]> {
    const offset = (page - 1) * limit;
    const users = await this.model.findAll({ offset });
    return users.map((user) => this.mapToDomain(user));
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.getOneUser({ email });
  }

  private mapToDomain(user: UserSequelizeModel): User;
  private mapToDomain(user: undefined): null;
  private mapToDomain(user: null): null;
  private mapToDomain(user: undefined | null): null;
  private mapToDomain(user: UserSequelizeModel | undefined | null): User | null;
  private mapToDomain(
    user: UserSequelizeModel | undefined | null,
  ): User | null {
    if (!user) {
      return null;
    }
    if (!user.id || !user.email) {
      throw new InternalServerErrorException();
    }
    return new User(user.toJSON());
  }
}
