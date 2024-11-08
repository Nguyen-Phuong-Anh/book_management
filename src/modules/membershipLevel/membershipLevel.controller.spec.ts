import { Test, TestingModule } from '@nestjs/testing';
import { MembershipLevelController } from './membershipLevel.controller';

describe('MembershipController', () => {
  let controller: MembershipLevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipLevelController],
    }).compile();

    controller = module.get<MembershipLevelController>(MembershipLevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
