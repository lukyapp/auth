import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { OauthProviderName } from '../../../application/oauth/beans/oauth-provider-name.enum';
import { Dto } from '../../../domain/common/dto';

export class OauthEndpointParam extends Dto<OauthEndpointParam> {
  @Expose()
  @IsEnum(OauthProviderName)
  declare public readonly oauthProviderName: OauthProviderName;
}
