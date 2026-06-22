import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text', {
    nullable: true,
  })
  description?: string;

  @Column({
    nullable: true,
  })
  eventDate?: Date;

  @Column({
    nullable: true,
  })
  location?: string;

  @Column({
    nullable: true,
  })
  vacancies?: number;

  @Column({
    default: 'OPEN',
  })
  status!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
