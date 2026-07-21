import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CompanyStatus } from '../company-status.enum';
import { CompanyOrigin } from '../company-origin.enum';

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

  @Column({ unique: true })
  email!: string;

  // Senha não aparece nas consultas normais.
  // O login busca explicitamente usando select.
  @Column({ select: false })
  password!: string;

  @Column()
  phone!: string;

  @Column()
  companySize!: string;

  @Column({
    type: 'enum',
    enum: CompanyOrigin,
    nullable: true,
  })
  origin?: CompanyOrigin;

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

  @Column({
    type: 'date',
    nullable: true,
  })
  foundationDate?: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  eventPresentation?: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  associationDate?: Date;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.INCOMPLETE,
  })
  status!: CompanyStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
