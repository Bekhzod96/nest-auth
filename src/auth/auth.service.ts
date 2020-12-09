import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { hash } from '../scripts/helpers';
import { UserService } from '../user/user.service';
import * as config from 'config';
import { RegisterUserDto } from './dto/register-user.dto';
import { Postgres, UserStatus } from '../common/enums';
import { LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from './interface/jwt-payload';
import { ResponseUserDto } from './dto/respose-user.dto';
import { User } from 'src/user/entities';
const jwtConfig = config.get('jwt');
@Injectable()
export class AuthService {
  logger = new Logger('Authentication');
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(
    registerUserDto: RegisterUserDto,
  ): Promise<ResponseUserDto> {
    const { password, phone, email } = registerUserDto;
    const hashedPassword = await hash(password, jwtConfig.APPLICATION_SECRET);
    let createdUser: User;
    try {
      createdUser = await this.userService.create({
        ...registerUserDto,
        password: hashedPassword,
        status: UserStatus.IN_VERIF,
      });
      const { id, username, phone, email, status } = createdUser;
      this.logger.verbose(
        `User Created Successfully with #${id} - email: ${email} `,
      );
      return { id, username, phone, email, status };
    } catch (err) {
      if (err.code === Postgres.Duplicated) {
        this.logger.verbose(
          `Tried to created User with
          existing phone: ${phone} of email: ${email} in system`,
          err.stack,
        );
        throw new ConflictException(
          'User with this phone number or email already exists!',
        );
      } else {
        this.logger.warn(
          `Can\'t create user with phone: ${phone} of email: ${email} in system`,
          err.stack,
        ),
          err.stack;
        throw new InternalServerErrorException("Can't create new user!");
      }
    }
  }

  async getAuthenticatedUser(
    loginUserDto: LoginUserDto,
    req: Request,
  ): Promise<ResponseUserDto> {
    const user = await this.userService.getAuthenticatedUser(loginUserDto);
    const { id, username, phone, email, status, password } = user;

    const accessTokenCookie = this.getCookieWithJwtAccessToken({
      id,
      username,
    });
    const refToken = this.getCookieWithJwtRefreshToken({
      id,
      username,
    });

    await this.userService.setRefreshToken(refToken, id);

    this.logger.debug(
      `Generated Access & Reresh Cookies to user:  #${id}: ${username}`,
    );

    req.res.cookie('Authentication', accessTokenCookie, {
      path: '/',
      httpOnly: true,
    });

    req.res.cookie('Refresh', refToken, {
      path: '/',
      httpOnly: true,
    });

    return { id, username, phone, email, status };
  }

  async getAuthenticateLocalStarategy(loginUserDto: LoginUserDto) {
    const user = await this.userService.getAuthenticatedUser(loginUserDto);
  }

  getCookieWithJwtAccessToken(jwtPayload: JwtPayload): string {
    const payload: JwtPayload = jwtPayload;
    const token = this.jwtService.sign(payload, {
      secret: jwtConfig.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: jwtConfig.JWT_ACCESS_TOKEN_EXPIRES,
    });
    return token;
  }

  private getCookieWithJwtRefreshToken(jwtPayload: JwtPayload): string {
    const payload: JwtPayload = jwtPayload;
    const refToken = this.jwtService.sign(payload, {
      secret: jwtConfig.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: jwtConfig.JWT_REFRESH_TOKEN_EXPIRES,
    });
    return refToken;
  }

  async getUserIfRefreshTokenMatches(
    id: number,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.findById(id);

    const isRefreshTokenMatching = await user.validateRefreshToken(
      refreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new NotFoundException(
        'User Not Found, Please Login with username and Password',
      );
    }
    return user;
  }

  async getCookieForLogOut(user) {
    return await this.userService.removeRefreshToken(user.id);
  }

  public findById(id): Promise<User> {
    return this.userService.findById(id);
  }
}
