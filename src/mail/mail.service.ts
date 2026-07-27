import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });

    this.from = `ACIST São Leopoldo <${this.configService.get<string>('GMAIL_USER')}>`;
  }

  async sendApprovalEmail(to: string, companyName: string) {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'Seu cadastro foi aprovado!',
      html: `
        <p>Olá, ${companyName}!</p>
        <p>Seu cadastro na ACIST São Leopoldo foi <strong>aprovado</strong>.</p>
        <p>Agora você já faz parte dos nossos associados.</p>
      `,
    });
  }

  async sendRegistrationLinkEmail(to: string, companyName: string, url: string) {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'Continue seu cadastro na ACIST São Leopoldo',
      html: `
        <p>Olá, ${companyName}!</p>
        <p>Recebemos a confirmação do seu pagamento. Para concluir seu cadastro, acesse o link abaixo:</p>
        <p><a href="${url}">${url}</a></p>
        <p>Esse link é válido por 7 dias.</p>
      `,
    });
  }
}
