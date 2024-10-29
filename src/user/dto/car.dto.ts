import { Car } from "../schema/car.schema";
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CarDto {
  id: string;
  make: string;
  model: string;
  year: string;
  price: number;
  mileage: number;
  status: CAR_STATUS;
  seller: any;

  getEntity() {
    const entity = new Car();
    entity.make = this.make;
    entity.model = this.model;
    entity.year = this.year;
    entity.price = this.price;
    entity.mileage = this.mileage;
    entity.status = this.status;
    entity.seller = this.seller;
    return entity;
  }
}

export function createFromEntity(entity: Car): CarDto {
  const dto = new CarDto();
  dto.id = entity._id.toString();
  dto.make = entity.make;
  dto.model = entity.model;
  dto.year = entity.year;
  dto.price = entity.price;
  dto.mileage = entity.mileage;
  dto.status = entity.status;
  dto.seller = entity.seller;
  return dto;
}

// export type CreateCar = Omit<Root, 'id'>;

export class CreateCar {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  mileage: number;

  @IsOptional()
  pictures?: Uint8Array[];

  @IsString()
  @IsNotEmpty()
  sellerId: string;
}

export enum CAR_STATUS {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
}

export enum FILE_TYPE {
  CAR_IMAGES = 'CAR_IMAGES',
  CAR_LOGOS = 'CAR_LOGOS',
}
