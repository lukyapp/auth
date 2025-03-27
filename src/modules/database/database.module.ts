import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigurationServicePort } from '../../application/config/service/configuration.service.port';
import { UserSequelizeModel } from '../../secondary-adapters/user/sequelize/user.sequlize-model';
import { ConfigurationModule } from '../config/configuration.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (configurationService: ConfigurationServicePort) => {
        return {
          dialect: configurationService.get('DB_DIALECT'),
          host: configurationService.get('DB_HOST'),
          port: configurationService.get('DB_PORT'),
          username: configurationService.get('DB_USERNAME'),
          password: configurationService.get('DB_PASSWORD'),
          database: configurationService.get('DB_NAME'),
          logging: console.log,
          models: [UserSequelizeModel],
        };
      },
      inject: [ConfigurationServicePort],
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
