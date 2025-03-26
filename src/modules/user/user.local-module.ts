import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRepositoryPort } from '../../application/user/services/user.repository.port';
import { UserRepositorySequelizeAdapter } from '../../secondary-adapters/user/sequelize/user-repository.sequelize-adapter';
import { UserSequelizeModel } from '../../secondary-adapters/user/sequelize/user.sequlize-model';

@Module({
  imports: [SequelizeModule.forFeature([UserSequelizeModel])],
  providers: [
    {
      provide: UserRepositoryPort,
      useClass: UserRepositorySequelizeAdapter,
    },
  ],
  exports: [UserRepositoryPort],
})
export class UserLocalModule {}
