import { Injectable, Logger } from '@nestjs/common';
import { decodeJwt, decodeProtectedHeader } from 'jose';
import { JwtHeaderExtractorPort } from '../../../application/jwks/services/jwt-header.extractor.port';

@Injectable()
export class JwtHeaderExtractorJoseAdapter implements JwtHeaderExtractorPort {
  private readonly logger = new Logger(this.constructor.name);

  extractFrom({ token }: { token: string }) {
    let decoded;
    try {
      decoded = {
        payload: decodeJwt(token),
        header: decodeProtectedHeader(token),
      };
    } catch (err: unknown) {
      this.logger.log('error decoding token : ', err);
      decoded = null;
    }
    const kid = decoded?.header.kid;
    const alg = decoded?.header.alg;

    return {
      kid,
      alg,
    };
  }
}
