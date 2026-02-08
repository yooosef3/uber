import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { DriverAuthService } from './auth.service';
import { Response, Request } from 'express';

@Injectable()
export class DriverAuthGuard implements CanActivate {
  constructor(private readonly authService: DriverAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('err_auth_unauthorized');
    }

    const authorized = await this.authService.authorize(token);

    const data = authorized;

    if (!data?.isAuthorized) {
      throw new UnauthorizedException('err_auth_unauthorized');
    }

    // if (authorized.driver && authorized.isActive === false) {
    //   throw new ForbiddenException('driver_inactive');
    // }

    request.driver = data.driver;
    request.session = data.session;
    request.acc_type = 'DRIVER';

    if (data.tokenData) {
      response.cookie('auth_driver', data.tokenData.token, {
        httpOnly: true,
        maxAge: data.tokenData.ttl,
      });
    }

    if (data.clearCookie) {
      response.clearCookie(data.clearCookie);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
