import { Module } from '@nestjs/common';
import { RentalPaymentController } from './rental-payment.controller';
import { RentalPaymentService } from './rental-payment.service';

@Module({
  controllers: [RentalPaymentController],
  providers: [RentalPaymentService]
})
export class RentalPaymentModule {}
