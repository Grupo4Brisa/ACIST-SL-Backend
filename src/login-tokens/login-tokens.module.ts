import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoginTokensController } from './login-tokens.controller';
import { LoginTokensService } from './login-tokens.service';
import { LoginToken } from './entities/login-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoginToken])],

  controllers: [LoginTokensController],

  providers: [LoginTokensService],

  exports: [LoginTokensService],
})
export class LoginTokensModule {}
