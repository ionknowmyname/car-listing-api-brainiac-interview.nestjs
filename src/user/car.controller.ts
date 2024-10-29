import { Body, Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { CarDto, CreateCar } from './dto/car.dto';
import { CarService } from './car.service';
import { ErrorResponse } from './dto/response/error.response';
import { SuccessResponse } from './dto/response/success.response';
import { FilterRequest } from './dto/filter.dto';
import { PaginationResponse } from './dto/response/pagination.response';

@Controller('api/car')
export class CarController {
  constructor(private carService: CarService) {}

  @Post()
  async createCarListing(
    @Body() data: CreateCar,
  ): Promise<ErrorResponse<string> | SuccessResponse<CarDto>> {
    try {
      const response = await this.carService.createCarListing(data);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Car created successfully!',
        data: response,
      };
    } catch (error) {
      return {
        statusCode: error?.error?.code,
        message: error.message,
        error: 'Failed to create car!',
      };
    }
  }

  @Get()
  async getAllCarListing(
    @Query() query: FilterRequest,
  ): Promise<
    ErrorResponse<string> | SuccessResponse<PaginationResponse<CarDto[]>>
  > {
    try {
      const response = await this.carService.getAllCarListing(query);

      return {
        statusCode: HttpStatus.OK,
        message: 'All Car Listing retrieved successfully!',
        data: response,
      };
    } catch (error) {
      return {
        statusCode: error?.error?.code,
        message: error.message,
        error: 'Failed to retrieve all car listing!',
      };
    }
  }

  @Get(':id')
  async getCarListById(
    @Param('id') id: string,
  ): Promise<ErrorResponse<string> | SuccessResponse<CarDto>> {
    try {
      const response = await this.carService.getCarListById(id);

      return {
        statusCode: HttpStatus.OK,
        message: 'Car Listing retrieved successfully!',
        data: response,
      };
    } catch (error) {
      return {
        statusCode: error?.error?.code,
        message: error.message,
        error: 'Failed to retrieve car listing!',
      };
    }
  }
}
