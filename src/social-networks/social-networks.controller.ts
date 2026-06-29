import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { SocialNetworksService } from './social-networks.service';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';

@Controller('social-networks')
export class SocialNetworksController {
  constructor(
    private readonly socialNetworksService: SocialNetworksService,
  ) {}

  @Get()
  findAll() {
    return this.socialNetworksService.findAll();
  }

  @Post()
  create(@Body() body: CreateSocialNetworkDto) {
    return this.socialNetworksService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialNetworksService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateSocialNetworkDto,
  ) {
    return this.socialNetworksService.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialNetworksService.remove(Number(id));
  }
}
