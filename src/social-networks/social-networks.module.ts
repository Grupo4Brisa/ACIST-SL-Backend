import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SocialNetworksController } from './social-networks.controller';
import { SocialNetworksService } from './social-networks.service';

import { SocialNetwork } from './entities/social-network.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocialNetwork])],
  controllers: [SocialNetworksController],
  providers: [SocialNetworksService],
  exports: [SocialNetworksService],
})
export class SocialNetworksModule {}