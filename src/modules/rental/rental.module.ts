import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { RentalPaymentModule } from '../rental-payment/rental-payment.module';
import { Rental } from './rental.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthMiddleware } from 'src/common/middleware/jwtAuth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental]),
    JwtModule.registerAsync({
      useFactory: () => {
          return {
              secret: process.env.JWT_SECRET_KEY,
              signOptions: { expiresIn: '5m'}
          }
      }
    }),
    RentalPaymentModule
  ],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(RentalController); 
  }
}
