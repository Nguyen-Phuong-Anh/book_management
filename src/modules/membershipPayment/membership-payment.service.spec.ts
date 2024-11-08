import { Test, TestingModule } from '@nestjs/testing';
import { MembershipPaymentService } from './membership-payment.service';

describe('MembershipPaymentService', () => {
  let service: MembershipPaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembershipPaymentService],
    }).compile();

    service = module.get<MembershipPaymentService>(MembershipPaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
