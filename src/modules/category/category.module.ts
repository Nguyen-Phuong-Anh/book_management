import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthMiddleware } from 'src/common/middleware/jwtAuth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    JwtModule.registerAsync({
      useFactory: () => {
          return {
              secret: process.env.JWT_SECRET_KEY,
              signOptions: { expiresIn: '5m'}
          }
      }
    })
  ],
    controllers: [CategoryController],
    providers: [CategoryService]
})
export class CategoryModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude(
        {path: '/categories', method: RequestMethod.GET},
        {path: '/categories/:id', method: RequestMethod.GET},
      )
      .forRoutes(CategoryController); 
  }
}
