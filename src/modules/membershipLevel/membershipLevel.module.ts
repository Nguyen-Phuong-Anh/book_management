import { MiddlewareConsumer, Module } from '@nestjs/common';

import { MembershipLevelService } from './membershipLevel.service';
import { MembershipLevelController } from './membershipLevel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipLevel } from './membershipLevel.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthMiddleware } from 'src/common/middleware/jwtAuth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipLevel]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '5m' }
        }
      }
    })
  ],
  controllers: [MembershipLevelController],
  providers: [MembershipLevelService]
})
export class MembershipLevelModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(MembershipLevelController);
  }
}
