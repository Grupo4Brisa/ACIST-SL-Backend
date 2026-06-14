export class CreatePaymentDto {
  companyId!: number;

  amount!: number;

  paymentType!: string;

  dueDate!: Date;
}
