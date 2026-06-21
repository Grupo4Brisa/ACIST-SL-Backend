import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('social_networks')
export class SocialNetwork {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  companyId!: number;

  @Column({
    nullable: true,
  })
  facebook!: string;

  @Column({
    nullable: true,
  })
  instagram!: string;

  @Column({
    nullable: true,
  })
  linkedin!: string;

  @Column({
    nullable: true,
  })
  other!: string;
}
