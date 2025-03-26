import { Dto } from '../../../domain/common/dto';

export class OauthProfile extends Dto<OauthProfile> {
  declare public readonly id?: string;
  declare public readonly name?: string;
  declare public readonly email?: string;
  declare public readonly isEmailVerified?: boolean;
}
