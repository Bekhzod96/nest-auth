import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user/entities';
import { Request } from 'express';
import * as config from 'config';
import { UserRepository } from '../../user/user.repository';
import { JwtPayload } from '../interface/jwt-payload';

const jwtConfig = config.get('jwt');

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET || jwtConfig.JWT_ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload, status): Promise<User> {
    console.log({ status });
    const { id } = payload;
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
