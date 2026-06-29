import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('login_tokens')
export class LoginToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyId!: number;

  @Column({
    unique: true,
  })
  token!: string;

  @Column({
    type: 'timestamp',
  })
  expiresAt!: Date;

  @Column({
    default: false,
  })
  used!: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
