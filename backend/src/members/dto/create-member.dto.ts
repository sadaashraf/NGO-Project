import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMemberDto {
  @IsString()
  // @IsNotEmpty()
  fullName: string;

  @IsString()
  // @IsNotEmpty()
  fatherName: string;

  @IsString()
  // @IsNotEmpty()
  phoneNumber: string;

  @IsNumber()
  // @IsNotEmpty()
  donationAmount: number;

  // @IsString()
  // @IsNotEmpty()
  // image?: string;

  // @IsString()
  // @IsNotEmpty()
  // paymentProof?: string;  // ← match Entity
}
