import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('company_solutions')
export class CompanySolution {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyId!: number;

  @Column()
  solutionId!: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
