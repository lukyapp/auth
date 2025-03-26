import { Injectable } from '@nestjs/common';
import { JWK } from 'jose';
import { JwkGeneratorPort } from '../services/jwk-generator.port';

@Injectable()
export class GetJwksUseCase {
  constructor(private readonly jwkGeneratorPort: JwkGeneratorPort) {}

  async perform(): Promise<JWK[]> {
    const keys = await this.jwkGeneratorPort.perform();
    return keys.map((key) => key.publicJWK);
  }
}
