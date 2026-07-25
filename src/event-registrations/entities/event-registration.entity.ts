import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('event_registrations')
export class EventRegistration {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  eventId!: number;

  @Column()
  companyId!: number;

  @Column({
    default: 'REGISTERED',
  })
  status!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  registeredAt!: Date;
}
