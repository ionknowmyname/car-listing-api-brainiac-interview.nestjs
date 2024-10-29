import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { CAR_STATUS } from '../dto/car.dto';

@Schema({ timestamps: true })
export class Car {
  _id: string;

  @Prop({ type: String, required: true })
  make: string;

  @Prop({ type: String, required: true })
  model: string;

  @Prop({ type: String, required: true })
  year: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  mileage: number;

  @Prop({ type: [String] })
  pictures: string[];

  @Prop({
    type: String,
    enum: CAR_STATUS,
    // default: CAR_STATUS.AVAILABLE,
  })
  status: CAR_STATUS;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  seller: User;
}

export type CarDocument = HydratedDocument<Car>;
export const CarSchema = SchemaFactory.createForClass(Car);
