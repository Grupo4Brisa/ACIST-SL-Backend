import { Controller, Get, Post, Body } from '@nestjs/common';

import { SocialNetworksService } from './social-networks.service';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';

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
}
