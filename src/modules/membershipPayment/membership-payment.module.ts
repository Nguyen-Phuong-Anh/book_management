import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MembershipPaymentController } from './membership-payment.controller';
import { MembershipPaymentService } from './membership-payment.service';
import { MembershipPayment } from './membership-payment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthMiddleware } from 'src/common/middleware/jwtAuth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipPayment]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '5m' }
        }
      }
    })
  ],
  controllers: [MembershipPaymentController],
  providers: [MembershipPaymentService]
})
export class MembershipPaymentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(MembershipPaymentController);
  }
}
