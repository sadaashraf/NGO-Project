import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { extname } from 'path';           // ← win32 کی بجائے عام path استعمال کریں (cross-platform)
import { diskStorage } from 'multer';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) { }

  // ── Create ─────────────────────────────────────────────────────
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'paymentProof', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf)$/)) {
            return cb(new BadRequestException('Only jpg, jpeg, png, gif, pdf allowed!'), false);
          }
          cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      },
    ),
  )
  async create(
    @Body() createMemberDto: CreateMemberDto,
    @UploadedFiles() files: { image?: Express.Multer.File[]; paymentProof?: Express.Multer.File[] },
  ) {
    const imageFile = files.image?.[0];
    const paymentProofFile = files.paymentProof?.[0];

    return this.membersService.create(createMemberDto, imageFile, paymentProofFile);
  }

  // ── Update normal fields (name, phone, etc) ────────────────────
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(+id, updateMemberDto);
  }

  // ── Update / Replace Profile Image ─────────────────────────────
  @Patch(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('Only images (jpg, jpeg, png, gif) allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    return this.membersService.updateImage(+id, file);
  }

  // ── Update / Replace Payment Proof ─────────────────────────────
  @Patch(':id/payment-proof')
  @UseInterceptors(
    FileInterceptor('paymentProof', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          return cb(new BadRequestException('Only jpg, jpeg, png, pdf allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updatePaymentProof(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Payment proof file is required');
    }
    return this.membersService.updatePaymentProof(+id, file);
  }

  // ── Other routes remain same ───────────────────────────────────
  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }
}