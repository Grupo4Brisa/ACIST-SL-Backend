import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { DocumentStatus } from '../document-status.enum';
import { DocumentType } from '../document-type.enum';

@Entity('documents')
export class Document {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyId!: number;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  documentType!: DocumentType;

  @Column()
  fileName!: string;

  @Column()
  mimeType!: string;

  @Column()
  fileSize!: number;

  @Column({
    type: 'bytea',
  })
  fileContent!: Buffer;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status!: DocumentStatus;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  uploadedAt!: Date;

}
