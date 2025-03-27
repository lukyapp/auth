import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariablesDto } from 'src/domain/config/environment-variables.dto';
import { ConfigurationServicePort } from '../../application/config/service/configuration.service.port';
import { EnvironmentVariables } from './environment-variables';

@Injectable()
export class ConfigurationServiceEnvAdapter
  implements ConfigurationServicePort
{
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  get<TKey extends keyof EnvironmentVariablesDto>(
    key: TKey,
  ): EnvironmentVariablesDto[TKey] {
    return this.configService.get(key);
  }
}
