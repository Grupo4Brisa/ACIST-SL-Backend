import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('solutions')
export class Solution {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  name!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
