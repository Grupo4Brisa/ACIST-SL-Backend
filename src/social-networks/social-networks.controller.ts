import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';
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

  @Get('company/:companyId')
  findByCompany(@Param('companyId') companyId: string) {
    return this.service.findByCompany(+companyId);
  }

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(@Body() body: CreateSocialNetworkDto, @Req() req: any) {
    return this.service.create(body, req.user ?? null);
  }

  @Patch(':companyId')
  @UseGuards(OptionalJwtAuthGuard)
  update(
    @Param('companyId') companyId: string,
    @Body() body: UpdateSocialNetworkDto,
    @Req() req: any,
  ) {
    return this.service.update(+companyId, body, req.user ?? null);
  }
}
