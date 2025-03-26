import { PrivateKey } from './jwk-generator.port';

export abstract class PrivateKeyToStringConverterPort {
  abstract convert(privateKey: PrivateKey): Promise<string>;
}
