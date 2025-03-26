import { InternalServerErrorException, Logger } from '@nestjs/common';

export class PublicKeyGetter {
  private readonly logger = new Logger(this.constructor.name);

  getByToken({ token }: { token: string }): Promise<string> {
    this.logger.log(`validating token : ${token}`);
    throw new InternalServerErrorException('dont use that');
  }
}
