import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class ProdService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.configService.get<string>('DATABASE_HOST'),

      port: Number(this.configService.get<string>('DATABASE_PORT')),

      username: this.configService.get<string>('DATABASE_USER'),

      password: this.configService.get<string>('DATABASE_PASSWORD'),

      database: this.configService.get<string>('DATABASE_NAME'),

      autoLoadEntities: true,

      // Em produção, normalmente NUNCA usar synchronize: true —
      // o ideal é usar migrations. Mas em um banco novo/vazio
      // (primeiro deploy, ainda sem migrations configuradas),
      // não existe outra forma de criar o schema inicial.
      //
      // Por isso isso é controlado por env var: defina
      // DATABASE_SYNC=true no Render SÓ para o primeiro deploy
      // (ou sempre que precisar recriar uma tabela nova), depois
      // REMOVA essa variável (ou coloque =false) e faça outro
      // deploy. Deixá-la true permanentemente é arriscado, porque
      // o synchronize pode alterar/apagar colunas sem aviso.
      synchronize: this.configService.get<string>('DATABASE_SYNC') === 'true',

      // A conexão externa do Render exige SSL. Se um dia você
      // conectar via rede interna (mesma região), pode desativar
      // via variável de ambiente.
      ssl:
        this.configService.get<string>('DATABASE_SSL') === 'true'
          ? { rejectUnauthorized: false }
          : false,
    };
  }
}
