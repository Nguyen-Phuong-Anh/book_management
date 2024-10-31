import { Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { RentalPaymentModule } from '../rental-payment/rental-payment.module';

@Module({
  controllers: [RentalController],
  providers: [RentalService],
  imports: [RentalPaymentModule]
})
export class RentalModule {}
