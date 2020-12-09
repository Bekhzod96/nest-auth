import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    await request.logout();
    const can: boolean = (await super.canActivate(context)) as boolean;
    if (can) {
      await super.logIn(request);
    }

    return can;
  }

  handleRequest(err, user, info, context, status) {
    console.log('LocalAuthguard', err);
    return super.handleRequest(err, user, info, context, status);
  }
}
