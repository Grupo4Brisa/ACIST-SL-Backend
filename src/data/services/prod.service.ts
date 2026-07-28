import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class ProdService implements TypeOrmOptionsFactory {

  constructor(
    private readonly configService: ConfigService,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {

    return {

      type: 'postgres',

      host: this.configService.get<string>('DATABASE_HOST'),

      port: Number(this.configService.get<string>('DATABASE_PORT')),

      username: this.configService.get<string>('DATABASE_USER'),

      password: this.configService.get<string>('DATABASE_PASSWORD'),

      database: this.configService.get<string>('DATABASE_NAME'),

      autoLoadEntities: true,

      // Em produção NUNCA usar synchronize: true — o schema
      // já foi criado pelo synchronize do ambiente de dev/local.
      // Se precisar alterar tabelas depois, use migrations.
      synchronize: false,

      // A conexão interna do Render (mesma região) não exige
      // SSL. Se um dia você conectar de fora do Render (ex: um
      // Postgres externo), ative isso via variável de ambiente.
      ssl:
        this.configService.get<string>('DATABASE_SSL') === 'true'
          ? { rejectUnauthorized: false }
          : false,

    };

  }

}
