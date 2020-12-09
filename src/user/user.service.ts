import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto, GetUserDto, CreateUserDto } from './dto';
import { User } from './entities/user.entity';
import { hash } from '../scripts/helpers';
import * as config from 'config';
const jwtConfig = config.get('jwt');
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private readonly user: User[] = [];

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    if (user) {
      return user;
    }
    throw new NotFoundException('User Not found');
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto,
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return this.userRepository.save(user);
  }

  async getAuthenticatedUser(getUserDto: GetUserDto): Promise<User> {
    const { email, phone, password } = getUserDto;
    const user = email
      ? await this.userRepository.findOne({ email })
      : await this.userRepository.findOne({ phone });

    if (user && (await user.validatePassword(password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid Credentials');
  }

  async setRefreshToken(refToken: string, userId: number): Promise<string> {
    const hashedRefreshToken = await hash(
      refToken,
      jwtConfig.JWT_REFRESH_TOKEN_SALT,
    );
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
    return 'Updated';
  }

  async removeRefreshToken(id: number) {
    return await this.update(id, {
      refreshToken: null,
    });
  }
}
