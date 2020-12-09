import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/user.repository';
import { LocalStrategy, JwtStrategy, JwtRefreshStrategy } from './strategy';

import * as config from 'config';
const jwtConfig = config.get('jwt');
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: jwtConfig.JWT_ACCESS_TOKEN_EXPIRES, // Expires in 30 min
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
