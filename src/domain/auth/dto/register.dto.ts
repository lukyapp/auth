import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  declare email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  declare password: string;
}
