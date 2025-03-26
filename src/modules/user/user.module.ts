import { Module } from '@nestjs/common';
import { UserCreatorByOauthStrategy } from '../../application/user/services/user-creator/user.creator.by-oauth-strategy';
import { UserCreatorByPasswordStrategy } from '../../application/user/services/user-creator/user.creator.by-password-strategy';
import { CreateOneUserUseCase } from '../../application/user/use-cases/create-one-user.use-case';
import { DeleteOneUserUseCase } from '../../application/user/use-cases/delete-one-user.use-case';
import { FindAllUsersUseCase } from '../../application/user/use-cases/find-all-users.use-case';
import { FindOneUserUseCase } from '../../application/user/use-cases/find-one-user.use-case';
import { UpdateOneUserUseCase } from '../../application/user/use-cases/update-one-user.use-case';
import { UtilsModule } from '../utils/utils.module';
import { UserLocalModule } from './user.local-module';
import { UserController } from '../../primary-adapters/user/user.controller';

const userInfraModule = UserLocalModule;

@Module({
  imports: [userInfraModule, UtilsModule],
  controllers: [UserController],
  providers: [
    UserCreatorByOauthStrategy,
    UserCreatorByPasswordStrategy,
    FindOneUserUseCase,
    CreateOneUserUseCase,
    UpdateOneUserUseCase,
    DeleteOneUserUseCase,
    FindAllUsersUseCase,
  ],
  exports: [
    userInfraModule,
    UserCreatorByOauthStrategy,
    UserCreatorByPasswordStrategy,
    FindOneUserUseCase,
    CreateOneUserUseCase,
    UpdateOneUserUseCase,
    DeleteOneUserUseCase,
    FindAllUsersUseCase,
  ],
})
export class UserModule {}
