import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, BadRequestException, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { extname } from 'path/win32';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1, },
        { name: 'paymentProof', maxCount: 1, },
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
          // You can make this stricter or per-field if needed
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf)$/)) {
            return cb(new BadRequestException('Only image or PDF files are allowed!'), false);
          }
          cb(null, true);
        },
        limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      },
    ),
  )
  async create(
    @Body() createMemberDto: CreateMemberDto,
    @UploadedFiles() files: {
      image?: Express.Multer.File[];
      paymentProof?: Express.Multer.File[];
    },
  ) {
    const imageFile = files.image?.[0];           // may be undefined
    const paymentProofFile = files.paymentProof?.[0]; // may be undefined

    return this.membersService.create(createMemberDto, imageFile, paymentProofFile);
  }


  @Get()
  findAll() {
    return this.membersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(+id);
  }
}
