import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApprovalStatus } from '../approval-status.enum';

@Entity('approvals')
export class Approval {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  companyId!: number;

  @ApiProperty()
  @Column()
  approvedBy!: number;

  @ApiProperty({ enum: ApprovalStatus })
  @Column({ type: 'enum', enum: ApprovalStatus, default: ApprovalStatus.PENDING })
  status!: ApprovalStatus;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  observation?: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}

