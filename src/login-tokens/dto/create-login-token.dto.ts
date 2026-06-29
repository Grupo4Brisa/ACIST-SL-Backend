export class CreateLoginTokenDto {
  companyId!: number;

  token!: string;

  expiresAt!: Date;

  used!: boolean;
}
