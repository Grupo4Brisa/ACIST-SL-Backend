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
}
