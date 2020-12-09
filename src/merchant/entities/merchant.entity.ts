import { Shop } from '../../shop/entities';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  registrationNumber: string;

  @Column({ type: 'varchar', nullable: true })
  bankAccountDetails: string;

  @Column({ type: 'varchar', nullable: true })
  verificationData: string;

  @Column('int', { nullable: true })
  representatives: string;

  @OneToMany(() => Shop, shop => shop.merchant)
  shops: Shop[];

  @Column({ type: 'varchar', nullable: true })
  contactDetails: string;

  @Column('varchar', { nullable: true })
  invoiceTemplate: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
