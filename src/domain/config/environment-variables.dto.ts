import { ExpiresIn } from '../../primary-adapters/common/validators/is-expires-in.validator';
import { Dto } from '../common/dto';

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

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Preproduction = 'preproduction',
}

export enum DatabaseDialect {
  Mysql = 'mysql',
  Postgres = 'postgres',
  Sqlite = 'sqlite',
  Mariadb = 'mariadb',
  Mssql = 'mssql',
}

export enum Protocol {
  Http = 'http',
  Https = 'https',
}

export class EnvironmentVariablesDto extends Dto<EnvironmentVariablesDto> {
  // ---------- SERVER ----------
  declare public readonly NODE_ENV: Environment;
  declare public readonly PORT: number;
  declare public readonly PROTOCOL: Protocol;
  declare public readonly HOST: string;
  declare public readonly BASE_URL: string;
  // ---------- jwt auth strategy ----------
  declare public readonly JWT_AUTH_STRATEGY_AUTHORIZED_AUDIENCES: string[];
  declare public readonly JWT_AUTH_STRATEGY_AUTHORIZED_ISSUERS: string[];
  declare public readonly JWT_AUTH_STRATEGY_AUTHORIZED_ALGORITHMS: AvailableAlgorithm[];
  // ---------- JWT ----------
  declare public readonly JWT_ISSUER: string;
  declare public readonly JWT_AUDIENCES: string[];
  declare public readonly JWT_ACCESS_EXPIRATION: ExpiresIn;
  declare public readonly JWT_REFRESH_EXPIRATION: ExpiresIn;
  // ---------- DB ----------
  declare public readonly DB_HOST: string;
  declare public readonly DB_PORT: number;
  declare public readonly DB_DIALECT: DatabaseDialect;
  declare public readonly DB_USERNAME: string;
  declare public readonly DB_PASSWORD: string;
  declare public readonly DB_NAME: string;
  // ---------- Mail ----------
  declare public readonly OAUTH_GOOGLE_CLIENT_ID: string;
  declare public readonly OAUTH_GOOGLE_CLIENT_SECRET: string;
  // ---------- Mail ----------
  declare public readonly MAIL_HOST: string;
  declare public readonly MAIL_PORT: number;
  declare public readonly MAIL_USER: string;
  declare public readonly MAIL_PASSWORD: string;
  declare public readonly MAIL_FROM: string;
  // ---------- Redis ----------
  declare public readonly REDIS_HOST: string;
  declare public readonly REDIS_PORT: number;
}
