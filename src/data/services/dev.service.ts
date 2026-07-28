import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DevService implements TypeOrmOptionsFactory {

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

      // Em desenvolvimento, o TypeORM cria/atualiza as
      // tabelas automaticamente a partir das entities —
      // conveniente localmente, mas NUNCA deve ser usado
      // em produção (pode alterar ou apagar dados sem aviso).
      synchronize: true,

    };

  }

}
