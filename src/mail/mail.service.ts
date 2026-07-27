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

  async sendAnnouncementEmail(to: string, companyName: string, title: string, content: string) {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: `[ACIST São Leopoldo] ${title}`,
      html: `
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
    });
  }
}

