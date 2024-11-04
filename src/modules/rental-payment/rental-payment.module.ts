import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RentalPaymentController } from './rental-payment.controller';
import { RentalPaymentService } from './rental-payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalPayment } from './rental-payment.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthMiddleware } from 'src/common/middleware/jwtAuth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([RentalPayment]),
    JwtModule.registerAsync({
      useFactory: () => {
          return {
              secret: process.env.JWT_SECRET_KEY,
              signOptions: { expiresIn: '5m'}
          }
      }
    })
  ],
  controllers: [RentalPaymentController],
  providers: [RentalPaymentService]
})
export class RentalPaymentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(RentalPaymentController); 
  }
}
