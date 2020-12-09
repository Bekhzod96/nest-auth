import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';
import * as config from 'config';
import { hash } from '../../scripts/helpers';
const jwtConfig = config.get('jwt');

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 200 })
  username: string;

  @Column('varchar', { length: 200, unique: true })
  email: string;

  @Column('varchar', { unique: true })
  phone: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  refreshToken?: string;

  @Column({ name: 'status', type: 'varchar' })
  status: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hashedPassword = await hash(password, jwtConfig.APPLICATION_SECRET);
    return hashedPassword === this.password;
  }

  async validateRefreshToken(refToken: string): Promise<boolean> {
    const hashedRefToken = await hash(
      refToken,
      jwtConfig.JWT_REFRESH_TOKEN_SALT,
    );
    return hashedRefToken === this.refreshToken;
  }
}
