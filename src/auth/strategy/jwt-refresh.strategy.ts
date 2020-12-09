import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../interface';
import { AuthService } from '../auth.service';
import * as config from 'config';
const jwtConfig = config.get('jwt');
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: jwtConfig.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request, payload: JwtPayload) {
    const refreshToken = request.cookies?.Refresh;
    return this.authService.getUserIfRefreshTokenMatches(
      payload.id,
      refreshToken,
    );
  }
}
