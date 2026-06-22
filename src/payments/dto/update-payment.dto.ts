export class UpdatePaymentDto {
  companyId?: number;

  amount?: number;

  paymentType?: string;

  status?: string;

  dueDate?: Date;

  paidAt?: Date;
}
