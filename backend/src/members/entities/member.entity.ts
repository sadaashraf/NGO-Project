import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('members')
export class Member {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  fatherName: string;

  @Column()
  phoneNumber: string;

  @Column()
  donationAmount: number;

  @Column('text', { array: true, nullable: true })
  image: string[];

  @Column({ nullable: true })
  paymentProof?: string;

  @Column({ type: 'varchar', default: 'UNPAID' })
  status: 'PAID' | 'UNPAID';
}
