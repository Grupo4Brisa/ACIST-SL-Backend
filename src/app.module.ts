import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import featuresConfig from './config/features.config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { CompanyContactsModule } from './company-contacts/company-contacts.module';
import { DocumentsModule } from './documents/documents.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { TasksModule } from './tasks/tasks.module';
import { PaymentsModule } from './payments/payments.module';
import { TermsAcceptanceModule } from './terms-acceptance/terms-acceptance.module';

import { SolutionsModule } from './solutions/solutions.module';
import { CompanySolutionsModule } from './company-solutions/company-solutions.module';
import { CompanyDisclosuresModule } from './company-disclosures/company-disclosures.module';

import { EventsModule } from './events/events.module';
import { EventRegistrationsModule } from './event-registrations/event-registrations.module';
import { SocialNetworksModule } from './social-networks/social-networks.module';
import { AnnouncementsModule } from './announcements/announcements.module';

import { DashboardModule } from './dashboard/dashboard.module';
import { LoginTokensModule } from './login-tokens/login-tokens.module';



@Module({

  imports: [



    // =========================
    // CONFIGURAÇÕES
    // =========================

    ConfigModule.forRoot({

      isGlobal: true,

      load: [
        featuresConfig,
      ],

    }),





    // =========================
    // BANCO DE DADOS
    // =========================

    TypeOrmModule.forRootAsync({

      inject: [
        ConfigService,
      ],


      useFactory: (

        config: ConfigService,

      ) => ({


        type: 'postgres',



        host:

          config.get<string>(

            'DATABASE_HOST',

          ),



        port:

          Number(

            config.get<string>(

              'DATABASE_PORT',

            ),

          ),




        username:

          config.get<string>(

            'DATABASE_USER',

          ),




        password:

          config.get<string>(

            'DATABASE_PASSWORD',

          ),




        database:

          config.get<string>(

            'DATABASE_NAME',

          ),





        autoLoadEntities: true,



        synchronize: false,



      }),

      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options!);
        await dataSource.initialize();
        try {
          await dataSource.query(
            "ALTER TABLE companies ALTER COLUMN origin TYPE varchar USING origin::varchar"
          );
          await dataSource.query("DROP TYPE IF EXISTS companies_origin_enum CASCADE");
          await dataSource.query("DROP TYPE IF EXISTS company_origin_enum CASCADE");
        } catch (_) {}
        try {
          await dataSource.query(
            "ALTER TABLE approvals ALTER COLUMN action TYPE varchar USING action::varchar"
          );
          await dataSource.query("DROP TYPE IF EXISTS approvals_action_enum CASCADE");
          await dataSource.query("DROP TYPE IF EXISTS approval_action_enum CASCADE");
        } catch (_) {}
        try {
          await dataSource.query(
            "ALTER TABLE approvals ALTER COLUMN \"userId\" DROP NOT NULL"
          );
        } catch (_) {}
        await dataSource.synchronize();
        return dataSource;
      },

    }),






    // =========================
    // MÓDULOS
    // =========================


    AuthModule,


    UsersModule,


    CompaniesModule,


    CompanyContactsModule,


    DocumentsModule,


    ApprovalsModule,


    TasksModule,


    PaymentsModule,


    TermsAcceptanceModule,



    SolutionsModule,


    CompanySolutionsModule,


    CompanyDisclosuresModule,



    EventsModule,


    EventRegistrationsModule,


    SocialNetworksModule,


    AnnouncementsModule,



    DashboardModule,


    LoginTokensModule,



  ],






  controllers: [

  ],






  providers: [

  ],



})


export class AppModule {}
