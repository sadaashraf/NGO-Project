import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import path from 'path';

@Injectable()
export class MembersService {

  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) { }

  async create(
    createMemberDto: CreateMemberDto,
    imageFile?: Express.Multer.File,
    paymentProofFile?: Express.Multer.File,
  ) {

    const existing = await this.memberRepo.findOneBy({
      phoneNumber: createMemberDto.phoneNumber,
    });

    if (existing) {
      throw new BadRequestException('Phone number already exists');
    }

    const newMember = this.memberRepo.create({
      ...createMemberDto,
      image: imageFile?.filename,
      paymentProof: paymentProofFile?.filename,
    });

    return this.memberRepo.save(newMember);
  }


  findAll() {
    return this.memberRepo.find();
  }

  async findOne(id: number) {
    const member = await this.memberRepo.findOneBy({ id });
    if (!member)
      throw new BadRequestException('Member not found');
    return member;
  }

  async update(id: number, dto: UpdateMemberDto) {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member)
      throw new BadRequestException('Member not found');
    Object.assign(member, dto);
    return this.memberRepo.save(member);
  }

  async remove(id: number) {
    const member = await this.memberRepo.findOneBy({ id });
    if (!member)
      throw new BadRequestException('Member not found');
    return this.memberRepo.delete(id);
  }

  async updateImage(id: number, file: Express.Multer.File) {
    const member = await this.memberRepo.findOne({ where: { id } });
    if (!member)
      throw new BadRequestException('Member not found');
    if (member.image) {
      const oldPath = path.join(process.cwd(), 'uploads', member.image);
      try {
        await unlink(oldPath);
      } catch { }
    }
    member.image = file.filename;
    return this.memberRepo.save(member);
  }

  async updatePaymentProof(id: number, file: Express.Multer.File) {
    const member = await this.memberRepo.findOne({ where: { id } });

    if (!member)
      throw new BadRequestException('Member not found');
    if (member.paymentProof) {
      const oldPath = path.join(process.cwd(), 'uploads', member.paymentProof);
      try {
        await unlink(oldPath);
      } catch { }
    }

    member.paymentProof = file.filename;
    return this.memberRepo.save(member);
  }

  async search(fullName: string, phoneNumber: string) {
    return this.memberRepo
      .createQueryBuilder('member')
      .where('member.fullName ILIKE :fullName', { fullName: `%${fullName}%` })
      .orWhere('member.phoneNumber ILIKE :phoneNumber', { phoneNumber: `%${phoneNumber}%` })
      .getMany();
  }

}
