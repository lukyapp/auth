import { Module } from '@nestjs/common';
import { JwkGeneratorJoseAdapter } from './jwk-generator.jose-adapter';
import { PrivateKeyToStringConverterJoseAdapter } from './private-key-to-string.converter.jose-adapter';
import { JwtHeaderExtractorJoseAdapter } from './jwt-header.extractor.jose-adapter';

@Module({
  imports: [],
  providers: [
    JwkGeneratorJoseAdapter,
    PrivateKeyToStringConverterJoseAdapter,
    JwtHeaderExtractorJoseAdapter,
  ],
  exports: [
    JwkGeneratorJoseAdapter,
    PrivateKeyToStringConverterJoseAdapter,
    JwtHeaderExtractorJoseAdapter,
  ],
})
export class JoseModule {}
