import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('company_contacts')
export class CompanyContact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyId!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  role!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
