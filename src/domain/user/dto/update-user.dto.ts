import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  declare email?: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsOptional()
  declare password?: string;
}
