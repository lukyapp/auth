import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  declare NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  declare PORT: number;

  @IsString()
  declare JWT_SECRET: string;

  @IsString()
  @Matches(/^\d+[smhd]$/, {
    message: 'JWT_ACCESS_EXPIRATION must be a number followed by s, m, h, or d',
  })
  declare JWT_ACCESS_EXPIRATION: string;

  @IsString()
  @Matches(/^\d+[smhd]$/, {
    message:
      'JWT_REFRESH_EXPIRATION must be a number followed by s, m, h, or d',
  })
  declare JWT_REFRESH_EXPIRATION: string;

  @IsString()
  declare DB_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  declare DB_PORT: number;

  @IsString()
  declare DB_USERNAME: string;

  @IsString()
  declare DB_PASSWORD: string;

  @IsString()
  declare DB_NAME: string;

  @IsString()
  declare MAIL_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  declare MAIL_PORT: number;

  @IsString()
  declare MAIL_USER: string;

  @IsString()
  declare MAIL_PASSWORD: string;

  @IsString()
  declare MAIL_FROM: string;

  @IsString()
  declare REDIS_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  declare REDIS_PORT: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
