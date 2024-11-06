import { Test, TestingModule } from '@nestjs/testing';
import { MembershipPaymentController } from './membership-payment.controller';

describe('MembershipPaymentController', () => {
  let controller: MembershipPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipPaymentController],
    }).compile();

    controller = module.get<MembershipPaymentController>(MembershipPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
