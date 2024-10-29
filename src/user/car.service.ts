import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument } from './schema/car.schema';
import {
  CAR_STATUS,
  CarDto,
  CreateCar,
  createFromEntity,
  FILE_TYPE,
} from './dto/car.dto';
import { UserService } from './user.service';
import { FilterRequest } from './dto/filter.dto';
import { PaginationResponse } from './dto/response/pagination.response';
import { CarHelper } from './helpers/car.helper';
import { CloudinaryService } from '../services/cloudinary.service';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    private userService: UserService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createCarListing(data: CreateCar): Promise<CarDto> {
    const foundUser = await this.userService.getOneUserByFilter({
      _id: data.sellerId,
    });

    if (!foundUser) {
      throw new NotFoundException('User not found!');
    }

    const carData: any = {
      ...data,
      status: CAR_STATUS.AVAILABLE,
      seller: foundUser,
    };

    let urls: string[] = [];
    if (data?.pictures?.length > 0) {
      // upload to cloudinary
      const cResponses = await Promise.all(
        data.pictures.map(async (file) => {
          const response = await this.cloudinaryService.uploadFile(
            file,
            FILE_TYPE.CAR_IMAGES,
          );
          return response;
        }),
      );

      urls = cResponses.map((cRes) => cRes.secure_url);

      carData['pictures'] = urls;
    }

    // const newCar = new this.carModel({ ...data });
    // newCar.pictures = urls;
    // newCar.status = CAR_STATUS.AVAILABLE;
    // newCar.seller = foundUser;
    const createdCar = await this.carModel.create(carData);
    return createFromEntity(createdCar);
  }

  async getAllCarListing(
    query: FilterRequest,
  ): Promise<PaginationResponse<CarDto[]>> {
    if (query.pageNumber) {
      query.pageNumber = Number(query.pageNumber);
    } else {
      query.pageNumber = Number(1);
    }

    if (query.pageSize) {
      query.pageSize = Number(query.pageSize);
    } else {
      query.pageSize = Number(10);
    }

    const pipeline = CarHelper.carListPipeline(query);

    const results = await this.carModel.aggregate(pipeline);

    return CarHelper.carsPagedMapper(
      results[0].data,
      query.pageNumber,
      query.pageSize,
    );
  }

  async getCarListById(id: string): Promise<CarDto> {
    const foundListing = await this.carModel.findOne({
      _id: id,
    });

    if (!foundListing) {
      throw new NotFoundException('Car listing not found!');
    }


    return createFromEntity(foundListing);
  }
}
