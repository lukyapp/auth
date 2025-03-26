import { Injectable } from '@nestjs/common';
import { exportPKCS8 } from 'jose';
import { PrivateKey } from '../../../application/jwks/services/jwk-generator.port';
import { PrivateKeyToStringConverterPort } from '../../../application/jwks/services/private-key-to-string.converter.port';

@Injectable()
export class PrivateKeyToStringConverterJoseAdapter
  implements PrivateKeyToStringConverterPort
{
  async convert(privateKey: PrivateKey): Promise<string> {
    return await exportPKCS8(privateKey.data);
  }
}
