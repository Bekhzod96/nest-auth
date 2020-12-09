import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { entryPoint } from '../common/constants';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/';
import { User } from '../user/entities';
import { ResponseUserDto } from './dto/respose-user.dto';

@ApiTags('Authentication')
@Controller(entryPoint + 'auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'SignUp New User' })
  @ApiResponse({ status: 400, description: 'All Validation Errors List' })
  @ApiResponse({
    status: 409,
    description: 'User with phone/email already exists',
  })
  @ApiResponse({
    status: 201,
    description: 'User Created Successfully',
  })
  register(@Body() registerUserDto: RegisterUserDto): Promise<ResponseUserDto> {
    return this.authService.register(registerUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Login and get user credentials' })
  @ApiResponse({ status: 401, description: 'Wrong Credetials!' })
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  login(
    @Body() loginUserDto: LoginUserDto,
    @Req() req: Request,
  ): Promise<ResponseUserDto> {
    return this.authService.getAuthenticatedUser(loginUserDto, req);
  }

  @UseGuards(JwtRefreshGuard)
  @ApiOperation({ summary: 'Refresh Access Token' })
  @Get('refresh')
  refresh(@Req() req: Request, @GetUser() user: User): string {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken({
      id: user.id,
      username: user.username,
    });
    req.res.cookie('Authentication', accessTokenCookie, {
      path: '/',
      httpOnly: true,
    });
    return 'Success';
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200, description: 'You logged out' })
  async logOut(@Req() req: Request, @GetUser() user: User): Promise<string> {
    await this.authService.getCookieForLogOut(user);
    req.res.clearCookie('Authentication');
    req.res.clearCookie('Refresh');
    return 'You logged out';
  }
}
