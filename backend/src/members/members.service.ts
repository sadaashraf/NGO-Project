import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';



@Injectable()
export class MembersService {

  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
  ) { }

  async create(createMemberDto: CreateMemberDto, file: Express.Multer.File, paymentProofFile: Express.Multer.File) {
    const member = await this.memberRepo.findOneBy({
      phoneNumber: createMemberDto.phoneNumber,
    });

    if (member) {
      throw new BadRequestException('Phone number already exists');
    }
    const newMember = this.memberRepo.create({
      ...createMemberDto,
      image: file?.filename ?? null,
      paymentProof: paymentProofFile?.filename ?? null,
    });
    return this.memberRepo.save(newMember);
  }


  findAll() {
    return this.memberRepo.find();
  }

  findOne(id: number) {
    const member = this.memberRepo.findOneBy({ id });
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
}
