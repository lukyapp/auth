import { IsEnum, IsNumber, IsString, IsUrl, Max, Min } from 'class-validator';
import {
  ExpiresIn,
  IsExpiresIn,
} from '../../primary-adapters/common/validators/is-expires-in.validator';

export enum AvailableAlgorithm {
  HS256 = 'HS256',
  HS384 = 'HS384',
  HS512 = 'HS512',
  RS256 = 'RS256',
  RS384 = 'RS384',
  RS512 = 'RS512',
  ES256 = 'ES256',
  ES384 = 'ES384',
  ES512 = 'ES512',
  PS256 = 'PS256',
  PS384 = 'PS384',
  PS512 = 'PS512',
}

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Preproduction = 'preproduction',
}

enum DatabaseDialect {
  Mysql = 'mysql',
  Postgres = 'postgres',
  Sqlite = 'sqlite',
  Mariadb = 'mariadb',
  Mssql = 'mssql',
}

export class EnvironmentVariables {
  // ---------- SERVER ----------

  @IsEnum(Environment)
  declare public readonly NODE_ENV: Environment;

  @IsNumber()
  @Min(0)
  @Max(65535)
  declare public readonly PORT: number;

  // ---------- JWT ----------

  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  declare public readonly JWT_ISSUER: string;

  @IsUrl({ protocols: ['http', 'https'], require_tld: false })
  declare public readonly JWT_AUDIENCE: string;

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
