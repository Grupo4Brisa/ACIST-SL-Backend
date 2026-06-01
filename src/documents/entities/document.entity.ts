import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyId!: number;

  @Column()
  documentType!: string;

  @Column()
  fileName!: string;

  @Column()
  filePath!: string;

  @Column({
    default: 'PENDING',
  })
  status!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  uploadedAt!: Date;
}
