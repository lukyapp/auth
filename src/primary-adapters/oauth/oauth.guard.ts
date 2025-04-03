import {
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IAuthGuard, IAuthModuleOptions } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ValidationService } from '../../infrastructure/utils/validation.service';
import { OauthAuthorizeEndpointQuery } from './dto/oauth-authorize-endpoint.query';
import { OauthEndpointParam } from './dto/oauth-endpoint.param';
import { OauthGuardProxy } from './oauth-guard.proxy';

@Injectable()
export class OauthGuard implements IAuthGuard {
  constructor(
    private readonly validationService: ValidationService,
    private readonly oauthGuardProxy: OauthGuardProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = this.getRequest(context);
    const guard = this.getOauthGuardFromRequest(request);

    if (request.url.split('?')[0]?.endsWith('callback')) {
      return guard.canActivate(context);
    }
    const { success_callback } = this.validationService.validate(
      OauthAuthorizeEndpointQuery,
      request.query,
    );
    // @ts-expect-error request.session
    request.session['successCallback'] = success_callback;
    return guard.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  logIn<TRequest extends { logIn: Function } = any>(
    request: TRequest,
  ): Promise<void> {
    const guard = this.getOauthGuardFromRequest(request as unknown as Request);
    return guard.logIn(request);
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    const request: Request = this.getRequest(context);
    const guard = this.getOauthGuardFromRequest(request);
    return guard.handleRequest(err, user, info, context, status);
  }

  getAuthenticateOptions(
    context: ExecutionContext,
  ): IAuthModuleOptions | undefined {
    const request: Request = this.getRequest(context);
    const guard = this.getOauthGuardFromRequest(request);
    return guard.getAuthenticateOptions(context);
  }

  getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }

  private getOauthGuardFromRequest(request: Request) {
    const { oauthProviderName } = this.validationService.validate(
      OauthEndpointParam,
      request.params,
    );
    const guard = this.oauthGuardProxy.resolve(oauthProviderName);
    if (!guard) {
      throw new InternalServerErrorException();
    }
    return guard;
  }
}
