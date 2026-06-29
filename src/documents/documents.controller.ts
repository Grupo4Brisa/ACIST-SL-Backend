import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}

  // =========================
  // CREATE (UPLOAD)
  // =========================
  @Post()
  @ApiOperation({ summary: 'Upload de documento' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        companyId: { type: 'number' },
        documentType: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['companyId', 'documentType', 'file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, unique + extname(file.originalname));
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  create(
    @Body() body: CreateDocumentDto,
    @UploadedFile() file: any,
  ) {
    return this.service.create({
      companyId: body.companyId,
      documentType: body.documentType,
      fileName: file.originalname,
      filePath: file.path,
    });
  }

  // =========================
  // FIND ALL
  // =========================
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // =========================
  // FIND ONE
  // =========================
  @Get(':id')
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  // =========================
  // UPDATE (COM TROCA DE ARQUIVO)
  // =========================
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        companyId: { type: 'number' },
        documentType: { type: 'string' },
        status: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() body: UpdateDocumentDto,
    @UploadedFile() file?: any,
  ) {
    return this.service.updateWithFile(+id, body, file);
  }

  // =========================
  // DELETE
  // =========================
  @Delete(':id')
  @ApiParam({ name: 'id', example: 1 })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
