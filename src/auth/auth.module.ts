import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';

import { RolesGuard } from './guards/roles.guard';


@Module({
  imports: [

    UsersModule,

    CompaniesModule,

    PassportModule,

    ConfigModule,


    JwtModule.registerAsync({

      imports: [
        ConfigModule,
      ],

      inject: [
        ConfigService,
      ],

      useFactory: (
        config: ConfigService,
      ) => ({

        secret:
          config.get<string>('JWT_SECRET')
          || 'secretKey',

        signOptions: {
          expiresIn: '1d',
        },

      }),

    }),

  ],


  controllers: [
    AuthController,
  ],


  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
  ],


  exports: [
    AuthService,
    RolesGuard,
    JwtModule,
    PassportModule,
  ],

})
export class AuthModule {}
