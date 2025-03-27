import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import axios from 'axios';
import { Request } from 'express';
import { decode, JwtPayload } from 'jsonwebtoken';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigurationServicePort } from '../../application/config/service/configuration.service.port';
import { Utils } from '../../utils/utils';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  public readonly logger = new Logger(this.constructor.name);

  constructor(public readonly configurationService: ConfigurationServicePort) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: (
        request: Request,
        rawJwtToken: string,
        done: (err: any, key?: string | Buffer) => void,
      ) => {
        JwtAuthStrategy.secretOrKeyProvider(
          request,
          rawJwtToken,
          done,
          this,
        ).catch((err) => {
          this.logger.log(err);
          done(err);
        });
      },
      algorithms: configurationService.get(
        'JWT_AUTH_STRATEGY_AUTHORIZED_ALGORITHMS',
      ),
      audience: configurationService.get(
        'JWT_AUTH_STRATEGY_AUTHORIZED_AUDIENCES',
      ),
      issuer: configurationService.get('JWT_AUTH_STRATEGY_AUTHORIZED_ISSUERS'),
    });
  }

  private static async secretOrKeyProvider(
    request: Request,
    rawJwtToken: string,
    done: (err: any, key?: string | Buffer) => void,
    jwtAuthStrategy: JwtAuthStrategy,
  ) {
    const jwtPayload = decode(rawJwtToken, { json: true });
    const { jwks_uri: jwksUri } = await this.getOpenIdConfig(
      jwtPayload,
      jwtAuthStrategy,
    );
    if (!jwksUri) {
      jwtAuthStrategy.logger.log('no jwksUri in the open id configuration');
      throw new UnauthorizedException();
    }
    jwtAuthStrategy.logger.log('jwksUri : ', jwksUri);
    passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri,
    })(request, rawJwtToken, done);
  }

  private static async getOpenIdConfig(
    jwtPayload: JwtPayload | null,
    jwtAuthStrategy: JwtAuthStrategy,
  ): Promise<{ jwks_uri?: string }> {
    if (!jwtPayload) {
      jwtAuthStrategy.logger.log('jwt payload is null');
      throw new UnauthorizedException();
    }
    const issuer = jwtPayload.iss;
    if (!issuer) {
      jwtAuthStrategy.logger.log('token issuer is null');
      throw new UnauthorizedException();
    }
    const { data } = await axios.get<{ jwks_uri?: string }>(
      Utils.urlJoin(issuer, '.well-known/openid-configuration'),
    );
    return data;
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      email: payload.email,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      roles: payload.roles,
    };
  }
}
