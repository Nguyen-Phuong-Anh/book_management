import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { JwtAuthMiddleware } from 'src/common/middleware/jwtAuth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    JwtModule.registerAsync({
      useFactory: () => {
          return {
              secret: process.env.JWT_SECRET_KEY,
              signOptions: { expiresIn: '5m'}
          }
      }
  })
  ],
    controllers: [BookController],
    providers: [BookService]
})
export class BookModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtAuthMiddleware)
      .exclude(
        {path: '/books', method: RequestMethod.GET},
        {path: '/books/:id', method: RequestMethod.GET},
        {path: '/books/search', method: RequestMethod.GET},
      )
      .forRoutes(BookController);
  }
}
