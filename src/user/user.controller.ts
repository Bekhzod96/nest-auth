import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { entryPoint } from '../common/constants';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller(entryPoint + 'user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 200,
    description: 'User successfully created.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'All user',
    type: [User],
  })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
