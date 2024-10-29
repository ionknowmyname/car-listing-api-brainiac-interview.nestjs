import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from '../user/car.controller';
import { CarService } from './car.service';
import { CAR_STATUS, CreateCar } from './dto/car.dto';
import { HttpStatus } from '@nestjs/common';
import { FilterRequest } from './dto/filter.dto';

describe('CarController', () => {
  let carController: CarController;
  let carService: CarService;

  const mockCarService = {
    createCarListing: jest.fn(),
    getAllCarListing: jest.fn(),
    getCarListById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useValue: mockCarService,
        },
      ],
    }).compile();

    carController = module.get<CarController>(CarController);
    carService = module.get<CarService>(CarService);
  });

  describe('createCarListing', () => {
    it('should create a car listing successfully', async () => {
      const carData: CreateCar = {
        make: 'Toyota',
        model: 'Camry',
        year: '2021',
        price: 20000,
        mileage: 10000,
        // pictures: ['test.jpg'],
        // status: CAR_STATUS.AVAILABLE,
        sellerId: 'seller-id',
      };

      const mockResponse = {
        _id: 'car-id',
        ...carData,
      };
      mockCarService.createCarListing.mockResolvedValue(mockResponse);

      const result = await carController.createCarListing(carData);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'Car created successfully!',
        data: mockResponse,
      });
      expect(mockCarService.createCarListing).toHaveBeenCalledWith(carData);
    });

    it('should return error response if required fields are missing', async () => {
      const incompleteCarData: Partial<CreateCar> = {
        model: 'Camry',
      };
      mockCarService.createCarListing.mockImplementation(() => {
        throw new Error('Required fields are missing');
      });

      const result = await carController.createCarListing(
        incompleteCarData as CreateCar,
      );

      expect(result).toEqual({
        statusCode: undefined,
        message: 'Required fields are missing',
        error: 'Failed to create car!',
      });
    });

  });

  describe('getAllCarListing', () => {
    it('should retrieve all car listings successfully', async () => {
      const mockFilter: FilterRequest = {
        keyword: 'Toyota',
        pageNumber: 1,
        pageSize: 10,
      };

      const mockResponse = {
        data: {
          data: [
            {
              id: '6721128c3965cfb2dec4be48',
              make: 'Toyota',
              model: 'Camry',
              year: '2021',
              price: 20000,
              mileage: 10000,
              status: 'AVAILABLE',
              seller: '672112793965cfb2dec4be45',
              // pictures: ['img1.jpg'],
            },
          ],
          pageNumber: 1,
          pageSize: 10,
          total: 1,
        },
      };

      mockCarService.getAllCarListing.mockResolvedValue(mockResponse);

      const result = await carController.getAllCarListing(mockFilter);

      expect(result).toEqual({
        statusCode: HttpStatus.OK,
        message: 'All Car Listing retrieved successfully!',
        data: mockResponse,
      });
      expect(mockCarService.getAllCarListing).toHaveBeenCalledWith(mockFilter);
    });

    it('should handle errors in retrieving car listings', async () => {
      mockCarService.getAllCarListing.mockImplementation(() => {
        throw new Error('Failed to fetch listings');
      });

      const result = await carController.getAllCarListing({} as FilterRequest);

      expect(result).toEqual({
        statusCode: undefined,
        message: 'Failed to fetch listings',
        error: 'Failed to retrieve all car listing!',
      });
    });
  });

  // describe('getCarListById', () => {
  //   it('should retrieve a car listing by ID successfully', async () => {
  //     const carId = 'car-id';
  //     const mockCarData = {
  //       _id: carId,
  //       make: 'Toyota',
  //       model: 'Camry',
  //       year: '2021',
  //       price: 20000,
  //       mileage: 10000,
  //       pictures: ['img1.jpg'],
  //       status: CAR_STATUS.AVAILABLE,
  //       seller: 'seller-id',
  //     };

  //     mockCarService.getCarListById.mockResolvedValue(mockCarData);

  //     const result = await carController.getCarListById(carId);

  //     expect(result).toEqual({
  //       statusCode: HttpStatus.OK,
  //       message: 'Car Listing retrieved successfully!',
  //       data: mockCarData,
  //     });
  //     expect(mockCarService.getCarListById).toHaveBeenCalledWith(carId);
  //   });

  //   it('should return error if car listing is not found', async () => {
  //     const invalidId = 'invalid-id';
  //     mockCarService.getCarListById.mockImplementation(() => {
  //       throw new Error('Car not found');
  //     });

  //     const result = await carController.getCarListById(invalidId);

  //     expect(result).toEqual({
  //       statusCode: undefined,
  //       message: 'Car not found',
  //       error: 'Failed to retrieve car listing!',
  //     });
  //   });

  //   it('should return error for invalid car ID format', async () => {
  //     const invalidId = '123'; // assuming a MongoDB ObjectId format is required
  //     mockCarService.getCarListById.mockImplementation(() => {
  //       throw new Error('Invalid ID format');
  //     });

  //     const result = await carController.getCarListById(invalidId);

  //     expect(result).toEqual({
  //       statusCode: undefined,
  //       message: 'Invalid ID format',
  //       error: 'Failed to retrieve car listing!',
  //     });
  //   });
  // });
  
});
