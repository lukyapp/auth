import { Injectable } from '@nestjs/common';
import { exportJWK, generateKeyPair, JWK } from 'jose';
import {
  JwkGeneratorPort,
  PrivateKey,
} from '../../../application/jwks/services/jwk-generator.port';
import { AvailableAlgorithm } from '../../../domain/config/environment-variables.dto';

@Injectable()
export class JwkGeneratorJoseAdapter implements JwkGeneratorPort {
  private keys: {
    publicJWK: JWK;
    privateKey: PrivateKey;
  }[] = [];

  constructor() {}

  async perform(): Promise<
    {
      publicJWK: JWK;
      privateKey: PrivateKey;
    }[]
  > {
    if (!this.keys.length) {
      await this.generateRSAJWK();
    }
    return this.keys;
  }

  private async generateRSAJWK() {
    const alg: AvailableAlgorithm = AvailableAlgorithm.RS512;
    const kid = 'main';

    const { publicKey, privateKey: privateKeyData } = await generateKeyPair(
      alg,
      {
        modulusLength: 4096,
      },
    );

    const publicJWK = await exportJWK(publicKey);
    publicJWK.kid = kid;
    publicJWK.alg = alg;
    publicJWK.use = 'sig';

    // const privateJWK = await exportJWK(privateKey);
    // privateJWK.kid = 'main';
    // privateJWK.use = 'enc';
    // privateJWK.alg = alg;

    const privateKey = new PrivateKey({
      kid,
      alg,
      data: privateKeyData,
    });

    this.keys.push({
      publicJWK,
      privateKey,
    });
  }
}
