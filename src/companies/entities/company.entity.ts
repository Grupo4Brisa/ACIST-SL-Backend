import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CompanyStatus } from '../company-status.enum';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyName!: string;

  @Column()
  corporateName!: string;

  @Column({ unique: true })
  cnpjcpf!: string;

  @Column({ nullable: true })
  stateRegistration?: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  companySize!: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  establishmentType?: string;

  @Column({ nullable: true })
  headquartersType?: string;

  @Column({ nullable: true })
  employeesCount?: number;

  @Column({ type: 'date', nullable: true })
  foundationDate?: Date;

  @Column({ type: 'text', nullable: true })
  eventPresentation?: string;

  @Column({ type: 'date', nullable: true })
  associationDate?: Date;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.INCOMPLETE,
  })
  status!: CompanyStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
