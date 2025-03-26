import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserBody } from './create-user.body';

export class UpdateUserBody extends PartialType(
  PickType(CreateUserBody, ['email', 'password']),
) {}
