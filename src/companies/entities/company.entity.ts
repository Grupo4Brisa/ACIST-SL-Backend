import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyName!: string;

  @Column()
  corporateName!: string;

  @Column({ unique: true })
  cnpj!: string;

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

  @Column({ nullable: true })
  foundationDate?: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  eventPresentation?: string;

  @Column({
    default: 'INCOMPLETE',
  })
  status!: string;
}
