import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('terms_acceptance')
export class TermsAcceptance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyId!: number;

  @Column({
    default: false,
  })
  accepted!: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  acceptedAt?: Date;

  @Column()
  termVersion!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
