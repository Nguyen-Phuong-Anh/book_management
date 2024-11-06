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
import { RentalModule } from './modules/rental/rental.module';
import { RentalPaymentModule } from './modules/rental-payment/rental-payment.module';
import { MembershipModule } from './modules/membership/membership.module';
import { MembershipLevelModule } from './modules/membershipLevel/membershipLevel.module';
import { MembershipPaymentModule } from './modules/membershipPayment/membership-payment.module';

@Module({
  imports: [
    UserModule,
    BookModule,
    CategoryModule,
    RentalModule,
    RentalPaymentModule,
    MembershipModule,
    MembershipLevelModule,
    MembershipPaymentModule,
    AuthModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'superpower',
      database: 'new',
      entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
      // migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
      // migrationsRun: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule { }
