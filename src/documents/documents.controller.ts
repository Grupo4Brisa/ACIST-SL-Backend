import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  StreamableFile,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';

import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

import { JwtAuthGuard } from '../auth/jwt.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/user-role.enum';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {

  constructor(
    private readonly service: DocumentsService,
  ) {}

  // =========================
  // CREATE (UPLOAD)
  // =========================

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Upload de documento',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        companyId: {
          type: 'number',
        },
        documentType: {
          type: 'string',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() body: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {

    return this.service.create({

      companyId: body.companyId,

      documentType: body.documentType,

      fileName: file.originalname,

      mimeType: file.mimetype,

      fileSize: file.size,

      fileContent: file.buffer,

    }, req.user?.id ?? null);

  }

  // =========================
  // LISTAR
  // =========================

  @Get()
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({
    summary: 'Listar documentos',
  })
  findAll() {

    return this.service.findAll();

  }

  // =========================
  // BUSCAR POR EMPRESA
  // =========================

  @Get('company/:companyId')
  @ApiOperation({
    summary: 'Listar documentos por empresa',
  })
  findByCompany(@Param('companyId') companyId: string) {
    return this.service.findByCompany(Number(companyId));
  }

  // =========================
  // BUSCAR POR ID
  // =========================

  @Get(':id')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({
    summary: 'Buscar documento por ID',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  findOne(
    @Param('id') id: string,
  ) {

    return this.service.findOne(+id);

  }

  // =========================
  // DOWNLOAD
  // =========================

  @Get(':id/download')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({
    summary: 'Download do documento',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  download(
    @Param('id') id: string,
  ): Promise<StreamableFile> {

    return this.service.download(+id);

  }

  // =========================
  // UPDATE
  // =========================

  @Patch(':id')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
    UserRole.COLABORADOR_APROVADOR,
  )
  @ApiOperation({
    summary: 'Atualizar documento',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() body: UpdateDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {

    return this.service.updateWithFile(
      +id,
      body,
      file,
    );

  }

  // =========================
  // DELETE
  // =========================

  @Delete(':id')
  @Roles(
    UserRole.COLABORADOR_ADMIN,
  )
  @ApiOperation({
    summary: 'Remover documento',
  })
  remove(
    @Param('id') id: string,
  ) {

    return this.service.remove(+id);

  }

}
