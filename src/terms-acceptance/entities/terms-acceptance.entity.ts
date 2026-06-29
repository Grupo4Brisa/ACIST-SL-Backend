import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity('terms_acceptance')
@Unique(['companyId', 'termVersion'])
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

  // =========================
  // ASSINATURA DIGITAL
  // =========================

  @Column({
    nullable: true,
  })
  documentUrl?: string;

  @Column({
    nullable: true,
  })
  signatureProvider?: string;

  @Column({
    nullable: true,
  })
  signatureId?: string;

  @Column({
    nullable: true,
  })
  signedDocumentHash?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
