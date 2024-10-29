import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types, HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export class User {
  _id: Types.ObjectId;

  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;
}

export type UserDocument = Document & User;
// export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
