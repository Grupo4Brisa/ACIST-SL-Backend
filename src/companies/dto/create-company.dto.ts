export class CreateCompanyDto {
  companyName!: string;

  corporateName!: string;

  cnpj!: string;

  email!: string;

  phone!: string;

  companySize!: string;

  stateRegistration?: string;

  website?: string;

  address?: string;

  neighborhood?: string;

  city?: string;

  state?: string;

  zipCode?: string;

  establishmentType?: string;

  headquartersType?: string;

  employeesCount?: number;

  foundationDate?: Date;

  eventPresentation?: string;

  associationDate?: Date;
}
