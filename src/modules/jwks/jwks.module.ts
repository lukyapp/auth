import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrivateKeyToStringConverterPort } from '../../application/jwks/services/private-key-to-string.converter.port';
import { JwtHeaderExtractorPort } from '../../application/jwks/services/jwt-header.extractor.port';
import { PublicKeyGetter } from '../../application/jwks/services/public-key.getter.port';
import { GetJwksUseCase } from '../../application/jwks/use-cases/get-jwks.use-case';
import { JwkGeneratorPort } from '../../application/jwks/services/jwk-generator.port';
import { JoseModule } from '../../infrastructure/jwks/jose/jose.module';
import { JwkGeneratorJoseAdapter } from '../../infrastructure/jwks/jose/jwk-generator.jose-adapter';
import { PrivateKeyToStringConverterJoseAdapter } from '../../infrastructure/jwks/jose/private-key-to-string.converter.jose-adapter';
import { JwtHeaderExtractorJoseAdapter } from '../../infrastructure/jwks/jose/jwt-header.extractor.jose-adapter';
import { JwksController } from '../../primary-adapters/jwks/jwks.controller';

@Module({
  controllers: [JwksController],
  imports: [JwksModule, JoseModule, ConfigModule],
  providers: [
    GetJwksUseCase,
    PublicKeyGetter,
    {
      provide: JwkGeneratorPort,
      useExisting: JwkGeneratorJoseAdapter,
    },
    {
      provide: JwtHeaderExtractorPort,
      useExisting: JwtHeaderExtractorJoseAdapter,
    },
    {
      provide: PrivateKeyToStringConverterPort,
      useExisting: PrivateKeyToStringConverterJoseAdapter,
    },
  ],
  exports: [
    GetJwksUseCase,
    JwkGeneratorPort,
    JwtHeaderExtractorPort,
    PrivateKeyToStringConverterPort,
    PublicKeyGetter,
  ],
})
export class JwksModule {}
