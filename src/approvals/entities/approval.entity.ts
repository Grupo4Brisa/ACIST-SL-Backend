import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApprovalAction } from '../approval-action.enum';

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
  userId!: number;

  @ApiProperty({ enum: ApprovalAction })
  @Column({ type: 'enum', enum: ApprovalAction })
  action!: ApprovalAction;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  observation?: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
