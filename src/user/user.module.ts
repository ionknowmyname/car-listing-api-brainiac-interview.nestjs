import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Car, CarSchema } from './schema/car.schema';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UserController, CarController],
  providers: [UserService, CarService, CloudinaryService],
  exports: [UserService, CarService],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Car.name,
        schema: CarSchema,
      },
    ]),
  ],
})
export class UserModule {}
