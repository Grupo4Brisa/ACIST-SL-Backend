import { Test, TestingModule } from '@nestjs/testing';
import { LoginTokensController } from './login-tokens.controller';
import { LoginTokensService } from './login-tokens.service';

describe('LoginTokensController', () => {
  let controller: LoginTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginTokensController],
      providers: [LoginTokensService],
    }).compile();

    controller = module.get<LoginTokensController>(LoginTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
