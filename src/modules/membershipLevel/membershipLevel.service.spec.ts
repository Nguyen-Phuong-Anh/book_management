import { Test, TestingModule } from '@nestjs/testing';
import { MembershipLevelService } from './membershipLevel.service';

describe('MembershipService', () => {
  let service: MembershipLevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipLevelService],
    }).compile();

    service = module.get<MembershipLevelService>(MembershipLevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
