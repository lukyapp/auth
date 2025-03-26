import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { BodyDto } from '../../common/dtos/body.dto';

export class CreateUserBody extends BodyDto<CreateUserBody> {
  @ApiProperty({
    example: 'test@example.com',
  })
  @IsEmail()
  declare public readonly email: string;

  @ApiProperty({
    example: 'test',
  })
  @IsString()
  @MinLength(8)
  declare public readonly password: string;
}
