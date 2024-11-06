import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MembershipController } from './membership.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Membership } from './membership.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthMiddleware } from 'src/common/middleware/jwtAuth.middleware';
import { MembershipService } from './membership.service';
import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Membership, User]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '5m' }
        }
      }
    }),
    UserModule
  ],
  controllers: [MembershipController],
  providers: [MembershipService]
})
export class MembershipModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(MembershipController);
  }
}
