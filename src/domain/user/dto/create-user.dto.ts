import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  declare email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  declare password: string;
}
