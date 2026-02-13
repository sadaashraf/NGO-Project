import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Constants } from 'src/utils/contants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    for (const url of Constants.BY_PASS_URLS) {
      if (request.url.includes(url)) {
        return true;
      }
    }

    return super.canActivate(context);
  }
}
