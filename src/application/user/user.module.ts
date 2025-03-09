import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRepositoryPort } from '../../domain/user/ports/user.repository.port';
import { UserServicePort } from '../../domain/user/ports/user.service.port';
import { UserModel } from '../../infrastructure/persistence/sequelize/models/user.model';
import { UserRepositorySequelizeAdapter } from '../../infrastructure/persistence/sequelize/repositories/user-repository.sequelize-adapter';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  controllers: [UserController],
  providers: [
    {
      provide: UserRepositoryPort,
      useClass: UserRepositorySequelizeAdapter,
    },
    {
      provide: UserServicePort,
      useClass: UserService,
    },
  ],
  exports: [UserServicePort, UserRepositoryPort],
})
export class UserModule {}
