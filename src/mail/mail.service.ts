import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private readonly brevo: BrevoClient;
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(private readonly configService: ConfigService) {
    this.brevo = new BrevoClient({
      apiKey: this.configService.get<string>('BREVO_API_KEY')!,
    });

    this.fromEmail = this.configService.get<string>('MAIL_FROM_EMAIL')!;
    this.fromName = this.configService.get<string>('MAIL_FROM_NAME')
      || 'ACIST São Leopoldo';
  }

  private async send(to: string, subject: string, html: string) {
    await this.brevo.transactionalEmails.sendTransacEmail({
      subject,
      htmlContent: html,
      sender: { name: this.fromName, email: this.fromEmail },
      to: [{ email: to }],
    });
  }

  async sendApprovalEmail(to: string, companyName: string) {
    await this.send(
      to,
      'Seu cadastro foi aprovado!',
      `
        <p>Olá, ${companyName}!</p>
        <p>Seu cadastro na ACIST São Leopoldo foi <strong>aprovado</strong>.</p>
        <p>Agora você já faz parte dos nossos associados.</p>
      `,
    );
  }

  async sendRegistrationLinkEmail(to: string, companyName: string, url: string) {
    await this.send(
      to,
      'Continue seu cadastro na ACIST São Leopoldo',
      `
        <p>Olá, ${companyName}!</p>
        <p>Recebemos a confirmação do seu pagamento. Para concluir seu cadastro, acesse o link abaixo:</p>
        <p><a href="${url}">${url}</a></p>
        <p>Esse link é válido por 7 dias.</p>
      `,
    );
  }

  async sendAnnouncementEmail(to: string, companyName: string, title: string, content: string) {
    await this.send(
      to,
      `[ACIST São Leopoldo] ${title}`,
      `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0C3A59;padding:20px;text-align:center">
            <h2 style="color:white;margin:0">ACIST São Leopoldo</h2>
          </div>
          <div style="padding:24px;background:#f9f9f9">
            <p style="color:#555">Olá, <strong>${companyName}</strong>!</p>
            <h3 style="color:#0C3A59">${title}</h3>
            <p style="color:#333;line-height:1.6">${content}</p>
          </div>
          <div style="padding:12px;background:#e5e5e5;text-align:center;font-size:12px;color:#888">
            ACIST São Leopoldo — Associação Comercial, Industrial, de Serviços e Tecnologia
          </div>
        </div>
      `,
    );
  }
}
