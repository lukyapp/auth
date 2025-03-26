import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/user/user.dto';
import { UserCreatorStrategy } from '../services/user-creator/user.creator.strategy';

@Injectable()
export class CreateOneUserUseCase {
  constructor() {}

  async perform<TBody, TUserCreator extends UserCreatorStrategy<TBody>>(
    userCreator: TUserCreator,
    body: TBody,
  ): Promise<User> {
    return userCreator.create(body);
  }
}
