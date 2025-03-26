import { Expose } from 'class-transformer';
import { JWK } from 'jose';
import { Dto } from '../../../domain/common/dto';

export class JwksResponse extends Dto<JwksResponse> {
  @Expose()
  declare public readonly keys: JWK[];
}
