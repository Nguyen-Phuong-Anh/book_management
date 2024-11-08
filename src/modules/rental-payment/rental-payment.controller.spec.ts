import { Test, TestingModule } from '@nestjs/testing';
import { RentalPaymentController } from './rental-payment.controller';

describe('RentalPaymentController', () => {
  let controller: RentalPaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalPaymentController],
    }).compile();

    controller = module.get<RentalPaymentController>(RentalPaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
