import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthMiddleware } from 'src/common/middleware/jwtAuth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => {
          return {
              secret: process.env.JWT_SECRET_KEY,
              signOptions: { expiresIn: '5m'}
          }
      }
  })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(UserController); 
  }
}
