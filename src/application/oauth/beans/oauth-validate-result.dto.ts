import { Dto } from '../../../domain/common/dto';
import { OauthProfile } from './oauth-profile.dto';

export class OauthValidateResult extends Dto<OauthValidateResult> {
  declare accessToken: string;
  declare refreshToken?: string;
  declare profile: OauthProfile;
}
