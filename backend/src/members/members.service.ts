import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import path from 'path/win32';



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
    const member = await this.memberRepo.findOneBy({
      phoneNumber: createMemberDto.phoneNumber,
    });

    if (member) {
      throw new BadRequestException('Phone number already exists');
    }

    const newMember = this.memberRepo.create({
      ...createMemberDto,
      image: imageFile?.path ?? undefined,
      paymentProof: paymentProofFile?.path ?? undefined,
    });

    return this.memberRepo.save(newMember);
  }


  findAll() {
    return this.memberRepo.find();
  }

  async findOne(id: number) {
    const member = await this.memberRepo.findOneBy({ id });
    if (!member) {
      throw new BadRequestException('Member not found');
    }
    return member;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const member = await this.memberRepo.findOneBy({ id });
    if (!member) {
      throw new BadRequestException('Member not found');
    }
    Object.assign(member, updateMemberDto);
    return this.memberRepo.save(member);
  }

  remove(id: number) {
    const member = this.memberRepo.findOneBy({ id });
    if (!member) {
      throw new BadRequestException('Member not found');
    } return this.memberRepo.delete(id);
  }

  async updateImage(id: number, imageFile?: Express.Multer.File) {
    const member = await this.memberRepo.findOneBy({ id });
    if (!member) throw new BadRequestException('Member not found');

    if (!imageFile) {
      throw new BadRequestException('No image file provided');
    }

    // delete old image if exists
    if (member.image) {
      const oldPath = path.join(__dirname, '..', '..', 'uploads', member.image);
      try {
        await unlink(oldPath);
      } catch (err) {
        console.warn(`Old image not deleted: ${err.message}`);
      }
    }

    member.image = imageFile.filename;
    return this.memberRepo.save(member);
  }

  async updatePaymentProof(id: number, proofFile?: Express.Multer.File) {
    const member = await this.memberRepo.findOneBy({ id });
    if (!member) throw new BadRequestException('Member not found');

    if (!proofFile) {
      throw new BadRequestException('No proof file provided');
    }

    // پرانی proof delete
    if (member.paymentProof) {
      const oldPath = path.join(__dirname, '..', '..', 'uploads', member.paymentProof);
      try {
        await unlink(oldPath);
      } catch (err) {
        console.warn(`Old proof not deleted: ${err.message}`);
      }
    }

    member.paymentProof = proofFile.filename;
    return this.memberRepo.save(member);
  }
}

