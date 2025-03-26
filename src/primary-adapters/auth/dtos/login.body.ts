import { IsEmail, IsString, MinLength } from 'class-validator';
import { BodyDto } from '../../common/dtos/body.dto';

export class LoginBody extends BodyDto<LoginBody> {
  @IsEmail()
  declare public readonly email: string;

  @IsString()
  @MinLength(8)
  declare public readonly password: string;
}
