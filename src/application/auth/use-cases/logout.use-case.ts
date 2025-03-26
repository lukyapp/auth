import { Injectable } from '@nestjs/common';
import {
  AuthTokenServicePort,
  LogoutBody,
} from '../services/auth-token.service.port';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly authTokenService: AuthTokenServicePort) {}

  async perform(body: LogoutBody): Promise<void> {
    return this.authTokenService.logout(body);
  }
}
