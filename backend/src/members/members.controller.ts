import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  UseInterceptors,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

import { extname } from 'path';
import { diskStorage } from 'multer';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) { }

  // ✅ CREATE MEMBER (image optional, proof optional, JSON supported)
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
            const name =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${name}${extname(file.originalname)}`);
          },
        }),

        fileFilter: (req, file, cb) => {
          if (
            !file.mimetype.match(
              /\/(jpg|jpeg|png|gif|pdf)$/,
            )
          ) {
            return cb(
              new BadRequestException(
                'Only jpg, jpeg, png, gif, pdf allowed',
              ),
              false,
            );
          }
          cb(null, true);
        },

        limits: {
          fileSize: 5 * 1024 * 1024,
        },
      },
    ),
  )
  async create(
    @Body() createMemberDto: CreateMemberDto,

    @UploadedFiles()
    files?: {
      image?: Express.Multer.File[];
      paymentProof?: Express.Multer.File[];
    },
  ) {
    // ✅ CRITICAL FIX
    const imageFile = files?.image?.[0];
    const paymentProofFile = files?.paymentProof?.[0];

    return this.membersService.create(
      createMemberDto,
      imageFile,
      paymentProofFile,
    );
  }

  // ✅ GET ALL
  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  // ✅ search by name or phone
  @Get('search')
  search(
    @Query('fullName') fullName: string,
    @Query('phoneNumber') phoneNumber: string,
  ) {
    return this.membersService.search(fullName, phoneNumber);
  }

  // ✅ GET ONE
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.findOne(+id);
  }

  // ✅ UPDATE NORMAL DATA
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMemberDto,
  ) {
    return this.membersService.update(id, dto);
  }

  // ✅ UPDATE IMAGE
  @Patch(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9);

          cb(null, `${name}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  updateImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException(
        'Image required',
      );

    return this.membersService.updateImage(
      +id,
      file,
    );
  }

  // ✅ UPDATE PAYMENT PROOF
  @Patch(':id/payment-proof')
  @UseInterceptors(
    FileInterceptor('paymentProof', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9);

          cb(null, `${name}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  updatePaymentProof(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException(
        'Proof required',
      );

    return this.membersService.updatePaymentProof(
      +id,
      file,
    );
  }

  // ✅ DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }
}


