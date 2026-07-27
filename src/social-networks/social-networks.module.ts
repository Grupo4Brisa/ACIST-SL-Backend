import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SocialNetworksController } from './social-networks.controller';
import { SocialNetworksService } from './social-networks.service';

import { SocialNetwork } from './entities/social-network.entity';
import { ApprovalsModule } from '../approvals/approvals.module';

@Module({
  imports: [TypeOrmModule.forFeature([SocialNetwork]), ApprovalsModule],
  controllers: [SocialNetworksController],
  providers: [SocialNetworksService],
  exports: [SocialNetworksService],
})
export class SocialNetworksModule {}