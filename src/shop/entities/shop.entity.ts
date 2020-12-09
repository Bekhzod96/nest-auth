import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Merchant } from '../../merchant/entities';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  address: string;

  @Column('varchar', { nullable: true })
  geolocation: string;

  @ManyToOne(() => Merchant, merchant => merchant.shops)
  merchant: Merchant;

  @Column('varchar', { nullable: true })
  type: string;

  @Column('varchar', { nullable: true })
  productCategories: string;

  @Column('json', { nullable: true })
  contactDetails: object;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
