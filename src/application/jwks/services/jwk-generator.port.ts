import { JWK, KeyLike } from 'jose';
import { Dto } from '../../../domain/common/dto';
import { AvailableAlgorithm } from '../../../infrastructure/config/environment-variables';

export class PrivateKey extends Dto<PrivateKey> {
  declare public readonly data: KeyLike;
  declare public readonly alg: AvailableAlgorithm;
  declare public readonly kid: string;
}

export abstract class JwkGeneratorPort {
  abstract perform(): Promise<
    {
      publicJWK: JWK;
      privateKey: PrivateKey;
    }[]
  >;
}
