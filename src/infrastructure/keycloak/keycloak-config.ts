import { Dto } from '../../domain/common/dto';

export class KeycloakConfig extends Dto<KeycloakConfig> {
  declare public readonly baseUrl: string;
  declare public readonly realmName: string;
  declare public readonly clientId: string;
  declare public readonly clientSecret: string;
  declare public readonly adminUsername: string;
  declare public readonly adminPassword: string;
  declare public readonly grantType: 'password';
}
