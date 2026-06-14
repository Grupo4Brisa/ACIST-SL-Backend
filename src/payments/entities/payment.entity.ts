import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyId!: number;

  @Column('decimal')
  amount!: number;

  @Column()
  paymentType!: string;

  @Column({
    default: 'PENDING',
  })
  status!: string;

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
