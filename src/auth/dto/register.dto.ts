import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  declare email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  declare password: string;

  @ApiProperty()
  @IsString()
  declare firstName: string;

  @ApiProperty()
  @IsString()
  declare lastName: string;
}