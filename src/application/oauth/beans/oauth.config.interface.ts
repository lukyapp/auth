import { Dto } from '../../../domain/common/dto';
import { OauthProviderName } from './oauth-provider-name.enum';

export abstract class OauthConfigI<
  TOauthName extends OauthProviderName = OauthProviderName,
> extends Dto<OauthConfigI<TOauthName>> {
  declare public readonly oauthName: TOauthName;

  declare public readonly clientID: string;
  declare public readonly clientSecret: string;

  declare public readonly domain: string;
  declare public readonly issuer?: string;
  declare public readonly jwksUri?: string;

  declare public readonly successURL: string;
  declare public readonly callbackURL: string;

  declare public readonly authorizationURL: string;
  declare public readonly tokenURL: string;
  declare public readonly userInfoURL: string;

  declare public readonly scope: string[];
}

export type RequiredOauthConfig = Pick<
  OauthConfigI,
  'clientID' | 'clientSecret' | 'callbackURL' | 'successURL'
>;
