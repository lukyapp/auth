import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetJwksUseCase } from '../../application/jwks/use-cases/get-jwks.use-case';
import { EnvironmentVariables } from '../../infrastructure/config/environment-variables';
import { Utils } from '../../utils/utils';
import { Get } from '../common/decorators/http.decorator';
import { OpenidConfiguration } from './dtos/get-openid-configuration.response';
import { JwksResponse } from './dtos/jwks.response';

@ApiTags('Jwks')
@Controller()
export class JwksController {
  constructor(
    private readonly getJwksUseCase: GetJwksUseCase,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  @Get('certs')
  @ApiOperation({ summary: 'Get Json Web Keys Set' })
  @ApiResponse({ status: 200, description: 'Json Web Keys Set' })
  async getJwks() {
    const keys = await this.getJwksUseCase.perform();
    return new JwksResponse({
      keys,
    });
  }

  @Get('.well-known/openid-configuration')
  @ApiOperation({ summary: 'Get openid configuration' })
  @ApiResponse({ status: 200, description: 'openid configuration' })
  getOpenidConfiguration() {
    return new OpenidConfiguration({
      jwks_uri: Utils.urlJoin(this.configService.get('JWT_ISSUER'), 'certs'),
    });
  }
}
