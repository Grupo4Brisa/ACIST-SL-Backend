import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { PaymentStatus } from '../payment-status.enum';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyId!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  amount!: number;

  @Column()
  paymentType!: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @Column({
    type: 'date',
  })
  dueDate!: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  paidAt?: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
