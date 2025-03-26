import { Expose } from 'class-transformer';
import { IsUrl } from 'class-validator';
import { Dto } from '../../../domain/common/dto';

export class OpenidConfiguration extends Dto<OpenidConfiguration> {
  @Expose()
  @IsUrl()
  declare public readonly jwks_uri: string;
}
