import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import featuresConfig from './config/features.config';

import { DevService } from './data/services/dev.service';
import { ProdService } from './data/services/prod.service';

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



const isProduction = process.env.NODE_ENV === 'production';



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
    //
    // NODE_ENV=production -> ProdService (synchronize: false)
    // qualquer outro valor -> DevService (synchronize: true)
    // =========================

    TypeOrmModule.forRootAsync({

      useClass: isProduction ? ProdService : DevService,

      dataSourceFactory: async (options) => {

        const dataSource = new DataSource(options!);

        await dataSource.initialize();


        try {
          await dataSource.query(
            "ALTER TABLE companies ALTER COLUMN origin TYPE varchar USING origin::varchar"
          );
          await dataSource.query("DROP TYPE IF EXISTS companies_origin_enum CASCADE");
          await dataSource.query("DROP TYPE IF EXISTS company_origin_enum CASCADE");
        } catch (_) {
          // coluna já é varchar, ajuste não necessário
        }


        try {
          await dataSource.query(
            "ALTER TABLE approvals ALTER COLUMN action TYPE varchar USING action::varchar"
          );
          await dataSource.query("DROP TYPE IF EXISTS approvals_action_enum CASCADE");
          await dataSource.query("DROP TYPE IF EXISTS approval_action_enum CASCADE");
        } catch (_) {
          // coluna já é varchar, ajuste não necessário
        }


        try {
          await dataSource.query(
            "ALTER TABLE approvals ALTER COLUMN \"userId\" DROP NOT NULL"
          );
        } catch (_) {
          // coluna já aceita nulo, ajuste não necessário
        }


        // Só sincroniza o schema automaticamente fora de
        // produção. Essa chamada SOBRESCREVIA o synchronize:
        // false definido acima — por isso, em produção, ela
        // precisa ficar condicionada ao mesmo NODE_ENV.
        if (!isProduction) {
          await dataSource.synchronize();
        }


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
