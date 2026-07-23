import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';



@Entity('company_disclosures')
export class CompanyDisclosure {



  @PrimaryGeneratedColumn()
  id!: number;



  @Index({ unique: true })
  @Column()
  companyId!: number;



  @Column({
    type: 'varchar',
    length: 200,
  })
  text!: string;



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
