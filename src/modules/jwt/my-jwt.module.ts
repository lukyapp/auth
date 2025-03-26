import { InternalServerErrorException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions, JwtSecretRequestType } from '@nestjs/jwt';
import { JwkGeneratorPort } from '../../application/jwks/services/jwk-generator.port';
import { PrivateKeyToStringConverterPort } from '../../application/jwks/services/private-key-to-string.converter.port';
import { PublicKeyGetter } from '../../application/jwks/services/public-key.getter.port';
import { EnvironmentVariables } from '../../infrastructure/config/environment-variables';
import { JwksModule } from '../jwks/jwks.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule, JwksModule],
      inject: [
        ConfigService,
        JwkGeneratorPort,
        PrivateKeyToStringConverterPort,
        PublicKeyGetter,
      ],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables, true>,
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
            expiresIn: configService.get('JWT_ACCESS_EXPIRATION'),
            issuer: configService.get('JWT_ISSUER'),
            audience: configService.get('JWT_AUDIENCE'),
            algorithm,
            keyid: privateKey.kid,
          },
          verifyOptions: {
            algorithms: [algorithm],
            audience: configService.get('JWT_AUDIENCE'),
            issuer: configService.get('JWT_ISSUER'),
            ignoreExpiration: false,
          },
        };
      },
    }),
  ],
  exports: [JwtModule],
})
export class MyJwtModule {}
