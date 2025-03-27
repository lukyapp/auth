import { InternalServerErrorException, Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions, JwtSecretRequestType } from '@nestjs/jwt';
import { ConfigurationServicePort } from '../../application/config/service/configuration.service.port';
import { JwkGeneratorPort } from '../../application/jwks/services/jwk-generator.port';
import { PrivateKeyToStringConverterPort } from '../../application/jwks/services/private-key-to-string.converter.port';
import { PublicKeyGetter } from '../../application/jwks/services/public-key.getter.port';
import { ConfigurationModule } from '../config/configuration.module';
import { JwksModule } from '../jwks/jwks.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigurationModule, JwksModule],
      inject: [
        ConfigurationServicePort,
        JwkGeneratorPort,
        PrivateKeyToStringConverterPort,
        PublicKeyGetter,
      ],
      useFactory: async (
        configurationService: ConfigurationServicePort,
        jwkGenerator: JwkGeneratorPort,
        jwkToPemConverter: PrivateKeyToStringConverterPort,
        publicKeyGetter: PublicKeyGetter,
      ) => {
        const keys = await jwkGenerator.perform();
        const key = keys[0];

        if (!key) {
          throw new InternalServerErrorException('no jwk key setted');
        }

        const privateKey = key.privateKey;
        const privateKeyPem = jwkToPemConverter.convert(privateKey);
        if (!privateKey.alg) {
          throw new InternalServerErrorException(
            'privateKey.alg need to be setted',
          );
        }
        const algorithm = privateKey.alg;

        const secretOrKeyProvider: JwtModuleOptions['secretOrKeyProvider'] =
          async (requestType, tokenOrPayload) => {
            if (requestType === JwtSecretRequestType.SIGN) {
              return privateKeyPem;
            }
            if (requestType === JwtSecretRequestType.VERIFY) {
              const token = tokenOrPayload as string;
              return publicKeyGetter.getByToken({ token });
            }
            throw new InternalServerErrorException('impossible request type');
          };

        return {
          secretOrKeyProvider,
          signOptions: {
            expiresIn: configurationService.get('JWT_ACCESS_EXPIRATION'),
            issuer: configurationService.get('JWT_ISSUER'),
            audience: configurationService.get('JWT_AUDIENCES'),
            algorithm,
            keyid: privateKey.kid,
          },
          verifyOptions: {
            algorithms: configurationService.get(
              'JWT_AUTH_STRATEGY_AUTHORIZED_ALGORITHMS',
            ),
            audience: configurationService.get(
              'JWT_AUTH_STRATEGY_AUTHORIZED_AUDIENCES',
            ),
            issuer: configurationService.get(
              'JWT_AUTH_STRATEGY_AUTHORIZED_ISSUERS',
            ),
            ignoreExpiration: false,
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class MyJwtModule {}
