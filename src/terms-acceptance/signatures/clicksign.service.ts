import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class ClicksignService {
  private readonly baseUrl = 'https://app.clicksign.com/api/v1';
  private readonly apiToken = process.env.CLICKSIGN_TOKEN;

  // =========================
  // CRIAR DOCUMENTO NA CLICKSIGN
  // =========================
  async createDocument(filePath: string, fileName: string) {
    try {
      const file = fs.readFileSync(filePath, {
        encoding: 'base64',
      });

      const response = await axios.post(
        `${this.baseUrl}/documents?access_token=${this.apiToken}`,
        {
          document: {
            path: `/${fileName}`,
            content_base64: file,
            content_type: 'application/pdf',
          },
        },
      );

      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || 'Erro ao criar documento na Clicksign',
        error.response?.status || 500,
      );
    }
  }

  // =========================
  // CRIAR SIGNATÁRIO
  // =========================
  async createSigner(name: string, email: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/signers?access_token=${this.apiToken}`,
        {
          signer: {
            name,
            email,
            auths: ['email'],
            documentation: '',
            birthday: '',
        },
        },
      );

      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || 'Erro ao criar signatário',
        error.response?.status || 500,
      );
    }
  }

  // =========================
  // VINCULAR SIGNATÁRIO AO DOCUMENTO
  // =========================
  async addSignerToDocument(documentKey: string, signerKey: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/lists?access_token=${this.apiToken}`,
        {
          list: {
            document_key: documentKey,
            signer_key: signerKey,
            sign_as: 'sign',
          },
        },
      );

      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data ||
          'Erro ao vincular signatário ao documento',
        error.response?.status || 500,
      );
    }
  }

  // =========================
  // INICIAR PROCESSO DE ASSINATURA
  // =========================
  async startSignature(documentKey: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/notifications?access_token=${this.apiToken}`,
        {
          request_signature_key: documentKey,
        },
      );

      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data ||
          'Erro ao iniciar assinatura',
        error.response?.status || 500,
      );
    }
  }
}
