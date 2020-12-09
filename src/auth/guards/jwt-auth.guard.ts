import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context) {
    return super.canActivate(context);
  }
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err || !user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
