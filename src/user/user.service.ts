import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './schema/user.schema';
import { createFromEntity, CreateUser, UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: CreateUser): Promise<UserDto> {
    // check that user doesn't exist

    const createdUser = await this.userModel.create(data);
    return createFromEntity(createdUser);
  }

  async getOneUserByFilter(filterQuery: FilterQuery<UserDocument>) {
    const user = await this.userModel.findOne(filterQuery);
    return user;
  }
}
