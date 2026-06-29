import { PartialType } from '@nestjs/swagger';
import { CreateLoginTokenDto } from './create-login-token.dto';

export class UpdateLoginTokenDto extends PartialType(CreateLoginTokenDto) {}
