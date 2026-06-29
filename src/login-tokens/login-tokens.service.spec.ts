import { Test, TestingModule } from '@nestjs/testing';
import { LoginTokensService } from './login-tokens.service';

describe('LoginTokensService', () => {
  let service: LoginTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginTokensService],
    }).compile();

    service = module.get<LoginTokensService>(LoginTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
