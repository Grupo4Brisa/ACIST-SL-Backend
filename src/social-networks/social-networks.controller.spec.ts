import { Test, TestingModule } from '@nestjs/testing';
import { SocialNetworksController } from './social-networks.controller';

describe('SocialNetworksController', () => {
  let controller: SocialNetworksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialNetworksController],
    }).compile();

    controller = module.get<SocialNetworksController>(SocialNetworksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
