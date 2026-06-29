import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
} from '@nestjs/common';

import { SocialNetworksService } from './social-networks.service';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';

@Controller('social-networks')
export class SocialNetworksController {
  constructor(private readonly service: SocialNetworksService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // buscar por empresa (muito mais útil no sistema)
  @Get('company/:companyId')
  findByCompany(@Param('companyId') companyId: string) {
    return this.service.findByCompany(+companyId);
  }

  @Post()
  create(@Body() body: CreateSocialNetworkDto) {
    return this.service.create(body);
  }

  @Patch(':companyId')
  update(
    @Param('companyId') companyId: string,
    @Body() body: UpdateSocialNetworkDto,
  ) {
    return this.service.update(+companyId, body);
  }
}
