import { IsEnum, IsNumber, IsString, IsUrl, Max, Min } from 'class-validator';
import {
  AvailableAlgorithm,
  DatabaseDialect,
  Environment,
  EnvironmentVariablesDto,
} from '../../domain/config/environment-variables.dto';
import { IsEnvArray } from '../../primary-adapters/common/validators/is-env-array.validator';
import {
  ExpiresIn,
  IsExpiresIn,
} from '../../primary-adapters/common/validators/is-expires-in.validator';

export class EnvironmentVariables implements EnvironmentVariablesDto {
  // ---------- SERVER ----------

  @IsEnum(Environment)
  declare public readonly NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  declare public readonly PORT: number;

  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  declare public readonly BASE_URL: string;

  // ---------- jwt auth strategy ----------

  @IsEnvArray()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false }, { each: true })
  declare public readonly JWT_AUTH_STRATEGY_AUTHORIZED_AUDIENCES: string[];

  @IsEnvArray()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false }, { each: true })
  declare public readonly JWT_AUTH_STRATEGY_AUTHORIZED_ISSUERS: string[];

  @IsEnvArray()
  @IsEnum(AvailableAlgorithm, { each: true })
  declare public readonly JWT_AUTH_STRATEGY_AUTHORIZED_ALGORITHMS: AvailableAlgorithm[];

  // ---------- JWT ----------

  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  declare public readonly JWT_ISSUER: string;

  @IsEnvArray()
  @IsUrl({ protocols: ['http', 'https'], require_tld: false }, { each: true })
  declare public readonly JWT_AUDIENCES: string[];

  @IsExpiresIn()
  declare public readonly JWT_ACCESS_EXPIRATION: ExpiresIn;

  @IsString()
  declare public readonly JWT_REFRESH_EXPIRATION: ExpiresIn;

  // ---------- DB ----------

  @IsString()
  declare public readonly DB_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  declare public readonly DB_PORT: number;

  @IsEnum(DatabaseDialect)
  declare public readonly DB_DIALECT: DatabaseDialect;

  @IsString()
  declare public readonly DB_USERNAME: string;

  @IsString()
  declare public readonly DB_PASSWORD: string;

  @IsString()
  declare public readonly DB_NAME: string;

  // ---------- Mail ----------

  @IsString()
  declare public readonly OAUTH_GOOGLE_CLIENT_ID: string;

  @IsString()
  declare public readonly OAUTH_GOOGLE_CLIENT_SECRET: string;

  // ---------- Mail ----------

  @IsString()
  declare public readonly MAIL_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  declare public readonly MAIL_PORT: number;

  @IsString()
  declare public readonly MAIL_USER: string;

  @IsString()
  declare public readonly MAIL_PASSWORD: string;

  @IsString()
  declare public readonly MAIL_FROM: string;

  // ---------- Redis ----------

  @IsString()
  declare public readonly REDIS_HOST: string;

  @IsNumber()
  @Min(0)
  @Max(65535)
  declare public readonly REDIS_PORT: number;
}
