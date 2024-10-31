import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './modules/book/book.module';
import { CategoryModule } from './modules/category/category.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './modules/auth/auth.module';
import { IsUniqueConstraint } from './shared/validation/is-unique-constraint.validation';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    BookModule,
    CategoryModule,
    AuthModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    BookModule, 
    CategoryModule, 
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'superpower',
      database: 'new',
      // entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
      // migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      // migrationsRun: true,
      // synchronize: false,  
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule {}
