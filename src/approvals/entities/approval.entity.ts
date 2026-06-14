import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('approvals')
export class Approval {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyId!: number;

  @Column()
  approvedBy!: number;

  @Column({
    default: 'PENDING',
  })
  status!: string;

  @Column({
    nullable: true,
  })
  observation?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
