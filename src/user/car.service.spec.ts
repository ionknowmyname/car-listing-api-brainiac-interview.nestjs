import { Test, TestingModule } from '@nestjs/testing';
import { Car } from './schema/car.schema';
import { CarService } from './car.service';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CloudinaryService } from '../services/cloudinary.service';
import { UserService } from './user.service';
import { CreateCar } from './dto/car.dto';
import { NotFoundException } from '@nestjs/common';
import { CarHelper } from './helpers/car.helper';


describe('CarService', () => {
  let carService: CarService;
  let userService: UserService;
  let cloudinaryService: CloudinaryService;
  let carModel: Model<Car>;

  const mockUserService = {
    getOneUserByFilter: jest.fn(),
  };

  const mockCloudinaryService = {
    uploadFile: jest.fn(),
  };

  const mockCarModel = {
    create: jest.fn(),
    aggregate: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getModelToken(Car.name),
          useValue: mockCarModel,
        },
        { provide: UserService, useValue: mockUserService },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    carService = module.get<CarService>(CarService);
    carModel = module.get<Model<Car>>(getModelToken(Car.name));
  });

  describe('createCarListing', () => {
    it('should create a car listing with uploaded pictures', async () => {
      const carData: CreateCar = {
        // _id: 'carId123',
        make: 'Toyota',
        model: 'Camry',
        year: '2021',
        price: 20000,
        mileage: 10000,
        sellerId: 'sellerId123',
        // pictures: ['img1.jpg', 'img2.jpg'],  // legit Uint8Array format needed
      };

      const mockUser = { _id: 'sellerId123' };
      const mockCarEntity = {
        _id: new mongoose.Types.ObjectId(),
        ...carData,
        save: jest.fn(),
      };
      const cloudinaryResponse = { secure_url: 'cloudinary_url' };

      mockUserService.getOneUserByFilter.mockResolvedValue(mockUser);
      mockCloudinaryService.uploadFile.mockResolvedValue(cloudinaryResponse);
      mockCarModel.create.mockResolvedValue(mockCarEntity);

      const result = await carService.createCarListing(carData);

      expect(mockUserService.getOneUserByFilter).toHaveBeenCalledWith({
        _id: carData.sellerId,
      });
      // expect(mockCloudinaryService.uploadFile).toHaveBeenCalledTimes(
      //   carData.pictures.length,
      // );
      expect(result).toEqual(
        expect.objectContaining({ make: 'Toyota', model: 'Camry' }),
      );
    });

    it('should throw NotFoundException if the user is not found', async () => {
      const carData: CreateCar = {
        make: 'Toyota',
        model: 'Camry',
        year: '2021',
        price: 20000,
        mileage: 10000,
        sellerId: 'invalidSellerId',
        pictures: [],
      };

      mockUserService.getOneUserByFilter.mockResolvedValue(null);

      await expect(carService.createCarListing(carData)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllCarListing', () => {
    it('should return paginated car listings', async () => {
      const query = { pageNumber: 1, pageSize: 10 };
      const mockPipeline = [
        {
          data: [{ _id: new mongoose.Types.ObjectId(), make: 'Toyota' }],
          total: 1,
        },
      ];

      jest.spyOn(CarHelper, 'carListPipeline').mockReturnValue(mockPipeline);
      mockCarModel.aggregate.mockResolvedValue(mockPipeline);

      const result = await carService.getAllCarListing(query);

      expect(mockCarModel.aggregate).toHaveBeenCalledWith(mockPipeline);
      expect(result).toContain({
        data: [{ make: 'Toyota' }],
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
        total: 1,
      });
    });
  });

  // describe('getCarListById', () => {
  //   it('should return a car listing by ID', async () => {
  //     const carId = 'carId123';
  //     const mockCar = { _id: carId, make: 'Toyota', model: 'Camry' };

  //     mockCarModel.findOne.mockResolvedValue(mockCar);

  //     const result = await service.getCarListById(carId);

  //     expect(mockCarModel.findOne).toHaveBeenCalledWith({ _id: carId });
  //     expect(result).toEqual(
  //       expect.objectContaining({ make: 'Toyota', model: 'Camry' }),
  //     );
  //   });

  //   it('should throw NotFoundException if the car is not found', async () => {
  //     const carId = 'invalidCarId';

  //     mockCarModel.findOne.mockResolvedValue(null);

  //     await expect(service.getCarListById(carId)).rejects.toThrow(
  //       NotFoundException,
  //     );
  //   });
  // });

});
