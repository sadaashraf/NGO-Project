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
  @Column()
  image?: string;          // /uploads/profile-we.jpg
  @Column()
  paymentProof?: string;     // /uploads/payment-go.jpg
  @Column()
  status: 'PAID' | 'UNPAID';
}
