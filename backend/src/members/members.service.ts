import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { unlink } from 'fs/promises';
import path from 'path';
import { paginate } from 'nestjs-typeorm-paginate/dist/paginate';
import { Pagination } from 'nestjs-typeorm-paginate/dist/pagination';
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces';
import { responseMessage } from 'src/common/respone.mommon';

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
      throw new BadRequestException('Phone no already exists');
    }

    const newMember = this.memberRepo.create({
      ...createMemberDto,
      image: imageFile ? [imageFile.filename] : [],
      paymentProof: paymentProofFile?.filename,
    });

    this.memberRepo.save(newMember);
    return {
      statusCode: HttpStatus.CREATED,
      message: responseMessage.CREATED_DATA,
      result: newMember,
    };
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Member>> {

    const queryBuilder = this.memberRepo.createQueryBuilder('m');
    queryBuilder.orderBy('m.id', 'DESC');
    return paginate<Member>(queryBuilder, options);

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

  async updateImages(id: number, files: Express.Multer.File[]) {
    const member = await this.memberRepo.findOne({ where: { id } });

    if (!member)
      throw new BadRequestException('Member not found');

    // Agar pehle images hain to unko delete karein
    if (member.image && member.image.length > 0) {
      for (const image of member.image) {
        const oldPath = path.join(process.cwd(), 'uploads', image);
        try {
          await unlink(oldPath);
        } catch { }
      }
    }

    // Naye filenames save karein
    member.image = files.map(file => file.filename);

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
