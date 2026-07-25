import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';


import { CompanyDisclosuresController } from './company-disclosures.controller';

import { CompanyDisclosuresService } from './company-disclosures.service';

import { CompanyDisclosure } from './entities/company-disclosure.entity';



@Module({

  imports: [

    TypeOrmModule.forFeature([

      CompanyDisclosure,

    ]),

  ],


  controllers: [

    CompanyDisclosuresController,

  ],


  providers: [

    CompanyDisclosuresService,

  ],


  exports: [

    CompanyDisclosuresService,

  ],

})


export class CompanyDisclosuresModule {}